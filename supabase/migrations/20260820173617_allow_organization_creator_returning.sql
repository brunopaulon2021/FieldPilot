drop policy if exists "organizations_select_members"
on public.organizations;

create policy "organizations_select_members_or_creator"
on public.organizations for select
to authenticated
using (
  created_by = (select auth.uid())
  or (select private.is_organization_member(id))
);
