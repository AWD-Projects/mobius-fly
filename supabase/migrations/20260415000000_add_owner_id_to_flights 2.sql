-- ═══════════════════════════════════════════════════════════════════════════
-- ADD owner_id TO flights + UNIQUE CONSTRAINT ON flight_code
--
-- owner_id links each flight to the owner who created it.
-- flight_code gets a UNIQUE constraint to support the MF-OWN4-YYMMDD-RND5
-- format — collision detection is handled at the application layer with a
-- retry loop on unique_violation (pg error code 23505).
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE flights
    ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES owners(user_id) ON DELETE SET NULL;

ALTER TABLE flights
    ADD CONSTRAINT flights_flight_code_key UNIQUE (flight_code);
