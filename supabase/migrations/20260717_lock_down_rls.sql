-- ============================================================
-- LOCK DOWN ROW LEVEL SECURITY
--
-- Previously rsvp_guests allowed public SELECT/INSERT/UPDATE/DELETE,
-- which let anyone with the public anon key read every guest's PII
-- (email, phone, FB link) and tamper with / delete any row.
--
-- All rsvp_guests access goes through service-role API routes
-- (/api/rsvp*), which bypass RLS. So we remove ALL public policies;
-- with RLS enabled and no policies, anon/authenticated clients are denied.
--
-- reviews stays publicly READABLE (testimonials shown on the homepage)
-- but writes now go through the service-role /api/reviews route.
-- ============================================================

-- ---- rsvp_guests: service-role only ----
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'rsvp_guests' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.rsvp_guests', pol.policyname);
  END LOOP;
END $$;

ALTER TABLE rsvp_guests ENABLE ROW LEVEL SECURITY;

-- ---- reviews: public read only, writes via service role ----
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reviews' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.reviews', pol.policyname);
  END LOOP;
END $$;

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read reviews"
  ON reviews FOR SELECT
  USING (true);
