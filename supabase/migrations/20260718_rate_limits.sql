-- ============================================================
-- DB-BACKED RATE LIMITER
-- Fixed-window counter shared across all serverless instances
-- (the project has no KV/Redis, so we use Postgres). Accessed only
-- via the service-role API through the check_rate_limit() function.
-- ============================================================

CREATE TABLE IF NOT EXISTS rate_limits (
  key          TEXT PRIMARY KEY,
  count        INT NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
-- No policies: anon/authenticated clients are denied. Only the service role
-- (used by the API + the function below) can read/write.

-- Atomically bumps the counter for a key within a fixed window and reports
-- whether the caller is allowed. Returns { allowed: bool, retry_after: int }.
CREATE OR REPLACE FUNCTION check_rate_limit(p_key text, p_limit int, p_window_seconds int)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  v_now          timestamptz := now();
  v_count        int;
  v_window_start timestamptz;
  v_reset        timestamptz;
BEGIN
  INSERT INTO rate_limits (key, count, window_start)
  VALUES (p_key, 1, v_now)
  ON CONFLICT (key) DO UPDATE SET
    count = CASE
      WHEN rate_limits.window_start < v_now - make_interval(secs => p_window_seconds) THEN 1
      ELSE rate_limits.count + 1
    END,
    window_start = CASE
      WHEN rate_limits.window_start < v_now - make_interval(secs => p_window_seconds) THEN v_now
      ELSE rate_limits.window_start
    END
  RETURNING count, window_start INTO v_count, v_window_start;

  v_reset := v_window_start + make_interval(secs => p_window_seconds);

  IF v_count > p_limit THEN
    RETURN json_build_object(
      'allowed', false,
      'retry_after', GREATEST(1, CEIL(EXTRACT(EPOCH FROM (v_reset - v_now)))::int)
    );
  END IF;

  RETURN json_build_object('allowed', true, 'retry_after', 0);
END;
$$;
