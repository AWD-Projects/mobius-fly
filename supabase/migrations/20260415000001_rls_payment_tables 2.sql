-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY — PAYMENT TABLES
--
-- Defense-in-depth: all backend writes go through service_role (bypasses RLS),
-- but these policies prevent accidental anon-key reads from leaking other
-- users' reservation and payment data.
--
-- Rules:
--   • Authenticated users can SELECT their own rows (user_id = auth.uid()).
--   • Guests (anon role) have no direct read access — they go through service_role.
--   • No client-side INSERT / UPDATE / DELETE: all mutations use service_role.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Enable RLS ────────────────────────────────────────────────────────────────

ALTER TABLE reservations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments               ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_passengers ENABLE ROW LEVEL SECURITY;

-- ── reservations ──────────────────────────────────────────────────────────────

CREATE POLICY "authenticated_users_view_own_reservations"
ON reservations
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ── payments ──────────────────────────────────────────────────────────────────

CREATE POLICY "authenticated_users_view_own_payments"
ON payments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- ── reservation_passengers ────────────────────────────────────────────────────

CREATE POLICY "authenticated_users_view_own_reservation_passengers"
ON reservation_passengers
FOR SELECT
TO authenticated
USING (
    reservation_id IN (
        SELECT id FROM reservations WHERE user_id = auth.uid()
    )
);
