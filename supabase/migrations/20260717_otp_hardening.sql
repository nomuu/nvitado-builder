-- ============================================================
-- OTP HARDENING
-- Adds server-side expiry, attempt limiting, and resend throttling
-- for the revision-access OTP flow (verify-invitation / verify-otp).
--   otp_expires_at   : OTP is only valid until this time
--   otp_attempts     : failed verification attempts (locks after a max)
--   otp_last_sent_at : used to throttle how often a new OTP can be sent
-- ============================================================

ALTER TABLE invitations
  ADD COLUMN IF NOT EXISTS otp_expires_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS otp_attempts     INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS otp_last_sent_at TIMESTAMPTZ;
