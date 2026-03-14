/**
 * Smart Factory MQTT Topic Hierarchy
 *
 * TOPIC STRUCTURE:
 *   sf/{siteId}/{buildingId}/{floorId}/{deviceId}/telemetry/{sensorType}  — sensor data
 *   sf/{siteId}/{deviceId}/cmd                                             — commands TO device
 *   sf/{siteId}/{deviceId}/cmd/ack                                         — ACK FROM device
 *   sf/{siteId}/{deviceId}/status                                          — online/offline heartbeat
 *   sf/{siteId}/alert                                                      — device-generated alerts
 */

// ---------------------------------------------------------------------------
// Sensor types
// ---------------------------------------------------------------------------
export type SensorType =
  | "temperature"
  | "humidity"
  | "pressure"
  | "vibration"
  | "power"
  | "flow"
  | "level"
  | "gas";

// ---------------------------------------------------------------------------
// Topic builder functions
// ---------------------------------------------------------------------------
export const TOPICS = {
  /**
   * Publish telemetry data from a specific sensor.
   * e.g. sf/site-01/building-A/floor-1/dev-001/telemetry/temperature
   */
  telemetry(
    siteId: string,
    buildingId: string,
    floorId: string,
    deviceId: string,
    sensorType: SensorType | string
  ): string {
    return `sf/${siteId}/${buildingId}/${floorId}/${deviceId}/telemetry/${sensorType}`;
  },

  /**
   * Publish a command to a device.
   * e.g. sf/site-01/dev-001/cmd
   */
  command(siteId: string, deviceId: string): string {
    return `sf/${siteId}/${deviceId}/cmd`;
  },

  /**
   * Device publishes command acknowledgement.
   * e.g. sf/site-01/dev-001/cmd/ack
   */
  commandAck(siteId: string, deviceId: string): string {
    return `sf/${siteId}/${deviceId}/cmd/ack`;
  },

  /**
   * Device publishes heartbeat / online-offline status.
   * e.g. sf/site-01/dev-001/status
   */
  deviceStatus(siteId: string, deviceId: string): string {
    return `sf/${siteId}/${deviceId}/status`;
  },

  /**
   * Device publishes threshold breach alert.
   * e.g. sf/site-01/alert
   */
  alert(siteId: string): string {
    return `sf/${siteId}/alert`;
  },
} as const;

// ---------------------------------------------------------------------------
// Wildcard subscribe patterns
// ---------------------------------------------------------------------------
export const WILDCARDS = {
  /**
   * Subscribe to ALL telemetry on a site.
   * Pattern: sf/{siteId}/+/+/+/telemetry/+
   */
  allTelemetry(siteId: string): string {
    return `sf/${siteId}/+/+/+/telemetry/+`;
  },

  /**
   * Subscribe to ALL device status on a site.
   * Pattern: sf/{siteId}/+/status
   */
  allStatus(siteId: string): string {
    return `sf/${siteId}/+/status`;
  },

  /**
   * Subscribe to ALL alerts on a site.
   * Pattern: sf/{siteId}/alert
   */
  allAlerts(siteId: string): string {
    return `sf/${siteId}/alert`;
  },

  /**
   * Subscribe to ALL commands on a site (backend use only).
   * Pattern: sf/{siteId}/+/cmd
   */
  allCommands(siteId: string): string {
    return `sf/${siteId}/+/cmd`;
  },

  /**
   * Subscribe to ALL command ACKs on a site.
   * Pattern: sf/{siteId}/+/cmd/ack
   */
  allCommandAcks(siteId: string): string {
    return `sf/${siteId}/+/cmd/ack`;
  },

  /**
   * Subscribe to everything on a site (admin/bridge use only).
   * Pattern: sf/{siteId}/#
   */
  everything(siteId: string): string {
    return `sf/${siteId}/#`;
  },
} as const;

// ---------------------------------------------------------------------------
// Topic parser
// ---------------------------------------------------------------------------
export interface ParsedTelemetryTopic {
  siteId: string;
  buildingId: string;
  floorId: string;
  deviceId: string;
  sensorType: string;
}

/**
 * Parse a telemetry topic string into its component parts.
 *
 * Expected format: sf/{siteId}/{buildingId}/{floorId}/{deviceId}/telemetry/{sensorType}
 *
 * @returns Parsed object or null if the topic does not match the expected format.
 */
export function parseTelemetryTopic(topic: string): ParsedTelemetryTopic | null {
  // sf / siteId / buildingId / floorId / deviceId / telemetry / sensorType
  const parts = topic.split("/");

  if (
    parts.length !== 7 ||
    parts[0] !== "sf" ||
    parts[5] !== "telemetry"
  ) {
    return null;
  }

  const [, siteId, buildingId, floorId, deviceId, , sensorType] = parts;

  if (!siteId || !buildingId || !floorId || !deviceId || !sensorType) {
    return null;
  }

  return { siteId, buildingId, floorId, deviceId, sensorType };
}

// ---------------------------------------------------------------------------
// Convenience: check topic type
// ---------------------------------------------------------------------------
export function isTelemetryTopic(topic: string): boolean {
  return parseTelemetryTopic(topic) !== null;
}

export function isCommandTopic(topic: string): boolean {
  const parts = topic.split("/");
  return parts.length === 4 && parts[0] === "sf" && parts[3] === "cmd";
}

export function isCommandAckTopic(topic: string): boolean {
  const parts = topic.split("/");
  return (
    parts.length === 5 &&
    parts[0] === "sf" &&
    parts[3] === "cmd" &&
    parts[4] === "ack"
  );
}

export function isStatusTopic(topic: string): boolean {
  const parts = topic.split("/");
  return parts.length === 4 && parts[0] === "sf" && parts[3] === "status";
}

export function isAlertTopic(topic: string): boolean {
  const parts = topic.split("/");
  return parts.length === 3 && parts[0] === "sf" && parts[2] === "alert";
}
