begin;
create table if not exists public.xbox_accounts (
 user_id uuid primary key references auth.users(id) on delete cascade,
 xuid text not null unique check (xuid ~ '^[0-9]{1,20}$'),
 verified_at timestamptz not null default now()
);
alter table public.xbox_accounts enable row level security;
grant all on public.xbox_accounts to service_role;
revoke all on public.xbox_accounts from anon, authenticated;
grant select(user_id, verified_at) on public.xbox_accounts to authenticated;
drop policy if exists "Read own Xbox link" on public.xbox_accounts;
create policy "Read own Xbox link" on public.xbox_accounts for select to authenticated using(auth.uid() = user_id);

create table if not exists public.xbox_oauth_states (
 state_hash text primary key check (state_hash ~ '^[a-f0-9]{64}$'),
 user_id uuid not null references auth.users(id) on delete cascade,
 expires_at timestamptz not null default now() + interval '10 minutes'
);
alter table public.xbox_oauth_states enable row level security;
grant all on public.xbox_oauth_states to service_role;
revoke all on public.xbox_oauth_states from anon, authenticated;
-- Edge Function service role only. One pending consent per account.
create or replace function public.begin_xbox_oauth(p_user_id uuid, p_state_hash text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 delete from public.xbox_oauth_states where user_id = p_user_id or expires_at < now();
 insert into public.xbox_oauth_states(state_hash, user_id) values(p_state_hash, p_user_id);
end;
$$;
revoke all on function public.begin_xbox_oauth(uuid,text) from public, anon, authenticated;
grant execute on function public.begin_xbox_oauth(uuid,text) to service_role;

create or replace function public.complete_xbox_link(p_user_id uuid, p_xuid text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 -- The unique XUID prevents a second account from voting with the same Xbox.
 -- Never silently transfer ownership or change an existing account's XUID.
 insert into public.xbox_accounts(user_id,xuid) values(p_user_id,p_xuid)
 on conflict(user_id) do update set verified_at=now()
 where xbox_accounts.xuid=excluded.xuid;
 if not found then raise exception 'Xbox account already linked'; end if;
end;
$$;
revoke all on function public.complete_xbox_link(uuid,text) from public, anon, authenticated;
grant execute on function public.complete_xbox_link(uuid,text) to service_role;

create or replace function public.has_verified_xbox()
returns boolean language sql stable security invoker set search_path = '' as $$
 select exists(select 1 from public.xbox_accounts where user_id=auth.uid());
$$;
revoke all on function public.has_verified_xbox() from public, anon;
grant execute on function public.has_verified_xbox() to authenticated;
-- Activate Xbox-only writes separately with xbox-enforce.sql after login is ready.
commit;
