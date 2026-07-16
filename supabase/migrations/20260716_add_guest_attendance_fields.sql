-- ============================================================
-- ADD ATTENDANCE FIELDS TO rsvp_guests
-- On the event day, the owner/organizer can check guests in.
--   attended     : whether the guest showed up (present)
--   attended_at  : timestamp the guest was marked present
--   remarks      : free notes, e.g. "+1 baby", "2 small kids",
--                  or "proxy for <name>" (someone attending in place
--                  of the invited guest)
-- ============================================================

ALTER TABLE rsvp_guests
  ADD COLUMN IF NOT EXISTS attended    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS attended_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS remarks     TEXT;
