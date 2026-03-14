-- =============================================================================
-- Smart Factory — TimescaleDB Initialization Script
-- Runs automatically on first container start via docker-entrypoint-initdb.d/
-- =============================================================================

-- Enable the TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- =============================================================================
-- TELEMETRY — core time-series table
-- =============================================================================

CREATE TABLE IF NOT EXISTS telemetry (
    -- Identification
    message_id   UUID         NOT NULL,
    device_id    VARCHAR(64)  NOT NULL,
    site_id      VARCHAR(64)  NOT NULL,
    sensor_id    VARCHAR(64)  NOT NULL,
    sensor_type  VARCHAR(32)  NOT NULL,

    -- Reading
    value        DOUBLE PRECISION NOT NULL,
    unit         VARCHAR(16)  NOT NULL,
    quality      VARCHAR(16)  NOT NULL CHECK (quality IN ('good', 'uncertain', 'bad')),

    -- Time (partition key — must be NOT NULL for hypertable)
    "timestamp"  TIMESTAMPTZ  NOT NULL,

    -- Constraints
    PRIMARY KEY (message_id, "timestamp")
);

-- Convert to TimescaleDB hypertable partitioned by time, 1 day per chunk
SELECT create_hypertable(
    'telemetry',
    'timestamp',
    chunk_time_interval => INTERVAL '1 day',
    if_not_exists       => TRUE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_telemetry_device_time
    ON telemetry (device_id, "timestamp" DESC);

CREATE INDEX IF NOT EXISTS idx_telemetry_site_time
    ON telemetry (site_id, "timestamp" DESC);

CREATE INDEX IF NOT EXISTS idx_telemetry_sensor_type_time
    ON telemetry (sensor_type, "timestamp" DESC);

-- Optional: automatic data retention (uncomment to keep only 90 days)
-- SELECT add_retention_policy('telemetry', INTERVAL '90 days');

-- Continuous aggregate: hourly averages per device+sensor
CREATE MATERIALIZED VIEW IF NOT EXISTS telemetry_hourly
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 hour', "timestamp") AS bucket,
    device_id,
    sensor_id,
    sensor_type,
    AVG(value)  AS avg_value,
    MIN(value)  AS min_value,
    MAX(value)  AS max_value,
    COUNT(*)    AS reading_count
FROM telemetry
GROUP BY bucket, device_id, sensor_id, sensor_type
WITH NO DATA;

-- Refresh policy: keep aggregate up-to-date
SELECT add_continuous_aggregate_policy(
    'telemetry_hourly',
    start_offset => INTERVAL '2 hours',
    end_offset   => INTERVAL '1 minute',
    schedule_interval => INTERVAL '1 hour',
    if_not_exists => TRUE
);

-- =============================================================================
-- DEVICE STATUS — online/offline heartbeat log
-- =============================================================================

CREATE TABLE IF NOT EXISTS device_status (
    id           BIGSERIAL    PRIMARY KEY,
    device_id    VARCHAR(64)  NOT NULL,
    site_id      VARCHAR(64)  NOT NULL,
    status       VARCHAR(16)  NOT NULL CHECK (status IN ('online', 'offline')),
    firmware     VARCHAR(32),
    rssi         SMALLINT,    -- dBm, negative value
    "timestamp"  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_device_status_device_time
    ON device_status (device_id, "timestamp" DESC);

-- Latest status per device (useful view for dashboard)
CREATE OR REPLACE VIEW device_latest_status AS
SELECT DISTINCT ON (device_id)
    device_id,
    site_id,
    status,
    firmware,
    rssi,
    "timestamp"
FROM device_status
ORDER BY device_id, "timestamp" DESC;

-- =============================================================================
-- ALERTS — threshold breach events
-- =============================================================================

CREATE TABLE IF NOT EXISTS alerts (
    alert_id     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id    VARCHAR(64)  NOT NULL,
    site_id      VARCHAR(64)  NOT NULL,
    sensor_id    VARCHAR(64)  NOT NULL,
    severity     VARCHAR(16)  NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    message      TEXT         NOT NULL,
    value        DOUBLE PRECISION NOT NULL,
    threshold    DOUBLE PRECISION NOT NULL,
    acknowledged BOOLEAN      NOT NULL DEFAULT FALSE,
    ack_by       VARCHAR(64),
    ack_at       TIMESTAMPTZ,
    "timestamp"  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_device_time
    ON alerts (device_id, "timestamp" DESC);

CREATE INDEX IF NOT EXISTS idx_alerts_severity_time
    ON alerts (severity, "timestamp" DESC);

CREATE INDEX IF NOT EXISTS idx_alerts_unacknowledged
    ON alerts (acknowledged, "timestamp" DESC)
    WHERE acknowledged = FALSE;

-- =============================================================================
-- COMMANDS — command audit log
-- =============================================================================

CREATE TABLE IF NOT EXISTS commands (
    command_id   UUID         PRIMARY KEY,
    device_id    VARCHAR(64)  NOT NULL,
    site_id      VARCHAR(64)  NOT NULL,
    action       VARCHAR(32)  NOT NULL,
    params       JSONB        NOT NULL DEFAULT '{}',
    issued_by    VARCHAR(64)  NOT NULL,
    issued_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    ttl_ms       INTEGER      NOT NULL DEFAULT 30000,

    -- ACK fields (populated when device responds)
    ack_status   VARCHAR(16)  CHECK (ack_status IN ('success', 'failed', 'timeout')),
    ack_message  TEXT,
    executed_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_commands_device_time
    ON commands (device_id, issued_at DESC);

CREATE INDEX IF NOT EXISTS idx_commands_pending
    ON commands (issued_at DESC)
    WHERE ack_status IS NULL;

-- =============================================================================
-- Utility: updated_at trigger function (reusable)
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Grant privileges to application user
-- =============================================================================

GRANT ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public TO sfadmin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sfadmin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO sfadmin;

-- Done
\echo 'SmartFactory TimescaleDB schema initialized successfully.'
