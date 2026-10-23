// Supabase Edge Function. Microsoft client secrets and Xbox tokens stay server-side.
import { createClient } from 'npm:@supabase/supabase-js@2';

const env = (name: string) => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing server configuration: ${name}`);
  return value;
};
const site = () => new URL(Deno.env.get('XBOX_SITE_URL') || 'https://saebye0k.github.io/Luminous-guide/');
const cors = () => ({
  'Access-Control-Allow-Origin': site().origin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
});
const digest = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map(byte => byte.toString(16).padStart(2, '0')).join('');
const random = () => Array.from(crypto.getRandomValues(new Uint8Array(32))).map(byte => byte.toString(16).padStart(2, '0')).join('');
const redirectUri = () => env('SUPABASE_URL') + '/functions/v1/verify-xbox';
const reply = (body: unknown, status = 200) => Response.json(body, {status, headers: cors()});
const finish = (failed: boolean) => {
  const url = site();
  if (failed) url.searchParams.set('xbox_error', 'verification_failed');
  return Response.redirect(url.toString(), 303);
};

async function xboxRequest(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: 'POST', headers: {'Content-Type': 'application/json', 'x-xbl-contract-version': '1'},
    body: JSON.stringify(payload), signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Xbox authorization rejected');
  return response.json();
}

Deno.serve(async (request: Request) => {
  try {
    if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors()});
    const admin = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {auth: {persistSession: false, autoRefreshToken: false}});
    if (request.method === 'GET') {
      // Return the one-use code to the initiating browser. Account linking only
      // happens in an authenticated POST, preventing account-linking login CSRF.
      const callback = new URL(request.url);
      const state = callback.searchParams.get('state');
      const code = callback.searchParams.get('code');
      if (callback.searchParams.has('error') || !state || !/^[a-f0-9]{64}$/.test(state) || !code || code.length > 8192) return finish(true);
      const destination = site();
      destination.searchParams.set('xbox_code', code);
      destination.searchParams.set('xbox_state', state);
      return Response.redirect(destination.toString(), 303);
    }
    if (request.method === 'POST') {
      if (request.headers.get('origin') !== site().origin) return reply({error: '허용되지 않은 요청입니다.'}, 403);
      const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
      if (!bearer) return reply({error: '로그인이 필요합니다.'}, 401);
      const {data, error} = await admin.auth.getUser(bearer);
      if (error || !data.user) return reply({error: '로그인이 필요합니다.'}, 401);
      if (!(data.user.identities || []).some(identity => identity.provider === 'azure')) return reply({error: 'Microsoft 계정 연동이 필요합니다.'}, 403);
      const body = await request.json();
      if (!Deno.env.get('XBOX_CLIENT_ID') || !Deno.env.get('XBOX_CLIENT_SECRET')) return reply({error: 'Xbox 로그인 설정이 준비 중입니다.'}, 503);
      if (body.action === 'start') {
        const state = random();
        // A random, short-lived, single-use state binds the callback to this user.
        // Never accept a user ID, XUID or redirect destination from the browser.
        const saved = await admin.rpc('begin_xbox_oauth', {p_user_id: data.user.id, p_state_hash: await digest(state)});
        if (saved.error) return reply({error: 'Xbox 연동을 시작하지 못했습니다.'}, 500);
        const authorize = new URL('https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize');
        authorize.search = new URLSearchParams({client_id: env('XBOX_CLIENT_ID'), response_type: 'code', response_mode: 'query', redirect_uri: redirectUri(), scope: 'XboxLive.signin', state}).toString();
        return reply({url: authorize.toString()});
      }
      if (body.action !== 'complete' || typeof body.state !== 'string' || !/^[a-f0-9]{64}$/.test(body.state) || typeof body.code !== 'string' || !body.code || body.code.length > 8192) return reply({error: '잘못된 Xbox 콜백입니다.'}, 400);
      const state = body.state;
      const code = body.code;
      // DELETE ... RETURNING atomically consumes state for this authenticated user.
      const pending = await admin.from('xbox_oauth_states').delete().eq('state_hash', await digest(state)).eq('user_id', data.user.id).gt('expires_at', new Date().toISOString()).select('user_id').maybeSingle();
      if (pending.error || !pending.data) return reply({error: 'Xbox 로그인 요청이 만료되었거나 다른 계정의 요청입니다.'}, 400);
      const tokenResponse = await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
        method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({client_id: env('XBOX_CLIENT_ID'), client_secret: env('XBOX_CLIENT_SECRET'), grant_type: 'authorization_code', code, redirect_uri: redirectUri()}),
        signal: AbortSignal.timeout(15000),
      });
      if (!tokenResponse.ok) return reply({error: 'Microsoft 인증에 실패했습니다.'}, 400);
      const token = await tokenResponse.json();
      if (typeof token.access_token !== 'string') return reply({error: 'Microsoft 인증에 실패했습니다.'}, 400);
      const userToken = await xboxRequest('https://user.auth.xboxlive.com/user/authenticate', {
        RelyingParty: 'http://auth.xboxlive.com', TokenType: 'JWT',
        Properties: {AuthMethod: 'RPS', SiteName: 'user.auth.xboxlive.com', RpsTicket: `d=${token.access_token}`},
      });
      if (typeof userToken.Token !== 'string') return reply({error: 'Xbox 인증에 실패했습니다.'}, 400);
      const xsts = await xboxRequest('https://xsts.auth.xboxlive.com/xsts/authorize', {
        RelyingParty: 'http://xboxlive.com', TokenType: 'JWT',
        Properties: {SandboxId: 'RETAIL', UserTokens: [userToken.Token]},
      });
      const claim = xsts.DisplayClaims?.xui?.[0];
      if (!claim || typeof claim.xid !== 'string' || !/^\d{1,20}$/.test(claim.xid)) return reply({error: 'Xbox 프로필을 확인하지 못했습니다.'}, 400);
      const linked = await admin.rpc('complete_xbox_link', {p_user_id: pending.data.user_id, p_xuid: claim.xid});
      return linked.error ? reply({error: '이미 연결된 Xbox 계정이거나 연동에 실패했습니다.'}, 409) : reply({ok: true});
    }
    return reply({error: 'Method not allowed'}, 405);
  } catch {
    // Never log callback codes, provider tokens, or upstream bodies.
    return request.method === 'GET' ? finish(true) : reply({error: 'Xbox 계정을 확인하지 못했습니다.'}, 500);
  }
});
