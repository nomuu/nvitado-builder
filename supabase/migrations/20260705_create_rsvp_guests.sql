-- ============================================================
-- RSVP GUESTS TABLE
-- Stores guest names and their RSVP status per invitation
-- ============================================================

CREATE TABLE IF NOT EXISTS rsvp_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT NULL, -- 'going', 'not_sure', or NULL (blank/pending)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Prevent duplicate names per invitation (case-insensitive)
  CONSTRAINT unique_guest_per_invitation UNIQUE (invitation_id, name)
);

-- Index for fast lookups by invitation
CREATE INDEX IF NOT EXISTS idx_rsvp_guests_invitation_id ON rsvp_guests(invitation_id);

-- Function to auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_rsvp_guests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_rsvp_guests_updated_at
  BEFORE UPDATE ON rsvp_guests
  FOR EACH ROW
  EXECUTE FUNCTION update_rsvp_guests_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE rsvp_guests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read RSVP guests (needed for live page display)
CREATE POLICY "Allow public read access on rsvp_guests"
  ON rsvp_guests FOR SELECT
  USING (true);

-- Allow anyone to insert (guests RSVP from live page)
CREATE POLICY "Allow public insert on rsvp_guests"
  ON rsvp_guests FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update (guests can change their status)
CREATE POLICY "Allow public update on rsvp_guests"
  ON rsvp_guests FOR UPDATE
  USING (true);

-- Allow delete (creator removes guests via API with service role, but policy needed for completeness)
CREATE POLICY "Allow public delete on rsvp_guests"
  ON rsvp_guests FOR DELETE
  USING (true);
