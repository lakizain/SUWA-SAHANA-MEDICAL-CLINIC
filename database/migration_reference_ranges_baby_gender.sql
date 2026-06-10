-- Allow "Baby" reference ranges (used by test-management UI and report entry).
-- Safe to re-run.

DO $$
DECLARE
  cname text;
BEGIN
  FOR cname IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'public'
      AND rel.relname = 'reference_ranges'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) ILIKE '%gender%'
  LOOP
    EXECUTE format('ALTER TABLE public.reference_ranges DROP CONSTRAINT %I', cname);
  END LOOP;
END $$;

ALTER TABLE public.reference_ranges
  ADD CONSTRAINT reference_ranges_gender_check
  CHECK (gender IN ('Male', 'Female', 'Both', 'Baby'));
