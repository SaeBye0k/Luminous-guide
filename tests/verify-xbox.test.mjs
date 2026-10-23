import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import ts from 'typescript';

const source=fs.readFileSync(new URL('../supabase/functions/verify-xbox/index.ts',import.meta.url),'utf8').replace(/^import .*?;\n/m,'');
function fixture({user={id:'user-1',identities:[{provider:'azure'}]},pending={user_id:'user-1'},linkError=null,claim={xid:'2533274790000000',gtg:'LuminousPlayer'},profileOwner='2533274790000000'}={}) {
  let handler; const calls=[]; const requests=[];
  const admin={auth:{getUser:async()=>({data:{user},error:null})},
    rpc:async(name,args)=>{calls.push({name,args});return {error:name==='complete_xbox_link'?linkError:null}},
    from:(table)=>{
      const query={
        delete:()=>query,
        eq:(column,value)=>{calls.push({table,column,value});return query},
        gt:()=>query,
        select:()=>query,
        maybeSingle:async()=>({data:pending?.user_id===user?.id?pending:null,error:null}),
      };
      return query;
    },
  };
  const vars={SUPABASE_URL:'https://project.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'server-only',XBOX_SITE_URL:'https://guide.example/Luminous-guide/',XBOX_CLIENT_ID:'client',XBOX_CLIENT_SECRET:'secret'};
  const context={exports:{},Request,Response,URL,URLSearchParams,TextEncoder,Uint8Array,AbortSignal,crypto:webcrypto,
    createClient:()=>admin,
    Deno:{env:{get:name=>vars[name]},serve:fn=>{handler=fn}},
    fetch:async(url,options)=>{requests.push({url,options});return Response.json(url.includes('/token')?{access_token:'microsoft-access'}:url.includes('user.auth')?{Token:'xbox-user-token'}:url.includes('profile.xboxlive')?{profileUsers:[{id:profileOwner,settings:[{id:'Gamertag',value:'LuminousPlayer'}]}]}:{Token:'xsts-token',DisplayClaims:{xui:[claim]}})},
  };
  vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText,context);
  return {handle:request=>handler(request),calls,requests};
}
const start=(origin='https://guide.example',auth='Bearer valid')=>new Request('https://project.supabase.co/functions/v1/verify-xbox',{method:'POST',headers:{origin,authorization:auth,'content-type':'application/json'},body:JSON.stringify({action:'start',user_id:'victim',xuid:'123',redirectTo:'https://attacker.example'})});
const complete=()=>new Request('https://project.supabase.co/functions/v1/verify-xbox',{method:'POST',headers:{origin:'https://guide.example',authorization:'Bearer valid','content-type':'application/json'},body:JSON.stringify({action:'complete',code:'oauth-code',state:'a'.repeat(64)})});
const callback=(extra='')=>new Request('https://project.supabase.co/functions/v1/verify-xbox?state='+'a'.repeat(64)+'&code=oauth-code'+extra);

test('rejects untrusted origins and unauthenticated requests before storing state',async()=>{
  const f=fixture();assert.equal((await f.handle(start('https://attacker.example'))).status,403);assert.equal((await f.handle(start('https://guide.example',''))).status,401);assert.equal(f.calls.length,0);
});
test('Google-only session cannot start Xbox authorization',async()=>{
  const f=fixture({user:{id:'legacy',identities:[{provider:'google'}]}});assert.equal((await f.handle(start())).status,403);assert.equal(f.calls.length,0);
});
test('starts Xbox-only consent bound to the authenticated account and fixed callback',async()=>{
  const f=fixture();const response=await f.handle(start());assert.equal(response.status,200);const {url}=await response.json();const authorize=new URL(url);
  assert.equal(authorize.origin,'https://login.microsoftonline.com');assert.equal(authorize.searchParams.get('scope'),'XboxLive.signin');assert.equal(authorize.searchParams.get('redirect_uri'),'https://project.supabase.co/functions/v1/verify-xbox');
  const state=authorize.searchParams.get('state');assert.match(state,/^[a-f0-9]{64}$/);assert.equal(f.calls[0].args.p_user_id,'user-1');assert.notEqual(f.calls[0].args.p_state_hash,state);assert.equal(f.requests.length,0);
});
test('expired or replayed callback cannot exchange tokens or link an account',async()=>{
  const f=fixture({pending:null});const response=await f.handle(complete());assert.equal(response.status,400);assert.equal(f.requests.length,0);assert.equal(f.calls.filter(x=>x.name==='complete_xbox_link').length,0);
});
test('denied consent returns a fixed error redirect without linking',async()=>{
  const f=fixture();const response=await f.handle(callback('&error=access_denied'));assert.equal(f.calls.length,0);assert.equal(f.requests.length,0);assert.match(response.headers.get('location'),/^https:\/\/guide.example\/Luminous-guide\//);
});
test('successful callback links only Xbox-verified XUID to the state owner',async()=>{
  const f=fixture();const response=await f.handle(complete());assert.equal(response.status,200);assert.equal((await response.json()).ok,true);assert.equal(f.requests.length,3);
  assert.equal(JSON.parse(f.requests[1].options.body).Properties.RpsTicket,'d=microsoft-access');assert.equal(JSON.parse(f.requests[2].options.body).Properties.UserTokens[0],'xbox-user-token');
  const link=f.calls.find(c=>c.name==='complete_xbox_link');assert.equal(link.args.p_user_id,'user-1');assert.equal(link.args.p_xuid,'2533274790000000');assert.equal(link.args.p_gamertag,'LuminousPlayer');
});
test('missing Xbox claims and duplicate-XUID database conflicts fail closed',async()=>{
  for(const args of [{claim:{uhs:'hash'}},{linkError:{code:'23505'}}]){
    const f=fixture(args);const response=await f.handle(complete());assert.ok(response.status>=400);
  }
});

test('callback redirects only to the configured site and cannot link without the initiating session',async()=>{
 const f=fixture();const response=await f.handle(callback());const destination=new URL(response.headers.get('location'));
 assert.equal(destination.origin,'https://guide.example');assert.equal(destination.searchParams.get('xbox_code'),'oauth-code');assert.equal(f.requests.length,0);assert.equal(f.calls.length,0);
 const foreign=fixture({pending:{user_id:'victim'}});assert.equal((await foreign.handle(complete())).status,400);assert.equal(foreign.requests.length,0);
});

test('gamertag fallback uses the authenticated XUID and rejects a different profile owner',async()=>{
 for(const owner of ['2533274790000000','999']){
  const f=fixture({claim:{xid:'2533274790000000',uhs:'userhash'},profileOwner:owner});
  const response=await f.handle(complete());
  assert.equal(response.status,owner==='999'?400:200);
  const profile=f.requests.find(r=>r.url.includes('profile.xboxlive'));
  assert.equal(profile.options.headers.Authorization,'XBL3.0 x=userhash;xsts-token');
  assert.equal(f.calls.filter(c=>c.name==='complete_xbox_link').length,owner==='999'?0:1);
 }
});
