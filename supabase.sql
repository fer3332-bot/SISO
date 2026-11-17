-- =====================================================================
--  Plataforma SISO · Base de datos en Supabase
--  Pega TODO este archivo en Supabase → SQL Editor → New query → Run
-- =====================================================================

-- 1) Tabla única de registros (cada formulario de la app es un "modulo")
create table if not exists public.registros (
  modulo      text        not null,
  id          text        not null,
  data        jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (modulo, id)
);

-- 2) Seguridad: solo usuarios con sesión iniciada pueden leer y escribir
alter table public.registros enable row level security;

drop policy if exists "siso_leer"     on public.registros;
drop policy if exists "siso_insertar" on public.registros;
drop policy if exists "siso_editar"   on public.registros;
drop policy if exists "siso_borrar"   on public.registros;
create policy "siso_leer"     on public.registros for select to authenticated using (true);
create policy "siso_insertar" on public.registros for insert to authenticated with check (true);
create policy "siso_editar"   on public.registros for update to authenticated using (true) with check (true);
create policy "siso_borrar"   on public.registros for delete to authenticated using (true);

-- 3) Tiempo real: lo que registras en el celular aparece solo en la computadora
do $$ begin
  alter publication supabase_realtime add table public.registros;
exception when duplicate_object then null; end $$;

-- 4) Almacenamiento privado para fotos, firmas y comprobantes PDF
insert into storage.buckets (id, name, public)
values ('evidencias', 'evidencias', false)
on conflict (id) do nothing;

drop policy if exists "siso_archivos_leer"   on storage.objects;
drop policy if exists "siso_archivos_subir"  on storage.objects;
drop policy if exists "siso_archivos_borrar" on storage.objects;
create policy "siso_archivos_leer"   on storage.objects for select to authenticated using (bucket_id = 'evidencias');
create policy "siso_archivos_subir"  on storage.objects for insert to authenticated with check (bucket_id = 'evidencias');
create policy "siso_archivos_borrar" on storage.objects for delete to authenticated using (bucket_id = 'evidencias');
