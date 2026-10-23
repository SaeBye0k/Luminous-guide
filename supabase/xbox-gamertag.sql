begin;
create or replace function public.complete_xbox_link(p_user_id uuid,p_xuid text,p_gamertag text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 if p_gamertag is null or char_length(trim(p_gamertag)) not between 2 and 20 then raise exception 'Invalid Xbox gamertag'; end if;
 insert into public.xbox_accounts(user_id,xuid) values(p_user_id,p_xuid)
 on conflict(user_id) do update set verified_at=now()
 where xbox_accounts.xuid=excluded.xuid;
 if not found then raise exception 'Xbox account already linked'; end if;
 insert into public.profiles(user_id,nickname) values(p_user_id,p_gamertag)
 on conflict(user_id) do update set nickname=excluded.nickname;
end;
$$;
revoke all on function public.complete_xbox_link(uuid,text,text) from public,anon,authenticated;
grant execute on function public.complete_xbox_link(uuid,text,text) to service_role;
commit;
