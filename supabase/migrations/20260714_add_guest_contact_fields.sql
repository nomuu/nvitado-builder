-- ============================================================
-- ADD GUEST CONTACT FIELDS TO rsvp_guests
-- Guests now self-register their identity + a contact method so
-- the invitation owner can verify them before marking as going.
-- Fields: fb_link, email, contact (at least one provided by guest)
-- ============================================================

ALTER TABLE rsvp_guests
  ADD COLUMN IF NOT EXISTS fb_link TEXT,
  ADD COLUMN IF NOT EXISTS email   TEXT,
  ADD COLUMN IF NOT EXISTS contact TEXT;
