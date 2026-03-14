/**
 * Smart Factory — Message Schemas
 *
 * All message types exchanged across the MQTT → Kafka → Backend pipeline.
 * Includes TypeScript interfaces, runtime validation helpers, and factory functions.
 */

import { randomUUID } from "crypto";

// ---------------------------------------------------------------------------
// Enumerations (shared across message types)
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

export type DataQuality = "good" | "uncertain" | "bad";

export type CommandAction =
  | "start"
  | "stop"
  | "restart"
  | "adjust"
  | "calibrate";

export type CommandStatus = "success" | "failed" | "timeout";

export type DeviceOnlineStatus = "online" | "offline";

export type AlertSeverity = "info" | "warning" | "critical";

// ---------------------------------------------------------------------------
// 1. Telemetry message  (sensor → EMQX → Kafka → TimescaleDB)
// ---------------------------------------------------------------------------

/**
 * Single sensor reading published by a device (or simulator).
 * Arrives on topic: sf/{siteId}/{buildingId}/{floorId}/{deviceId}/telemetry/{sensorType}
 */
export interface TelemetryMessage {
  /** Unique message identifier (UUID v4) */
  messageId: string;
  deviceId: string;
  siteId: string;
  sensorId: string;
  sensorType: SensorType | string;
  value: number;
  /** SI unit string, e.g. "°C", "bar", "kW", "L/min", "mm/s", "%" */
  unit: string;
  quality: DataQuality;
  /** Unix epoch milliseconds */
  timestamp: number;
}

// ---------------------------------------------------------------------------
// 2. Command message  (frontend → API → Kafka → EMQX → device)
// ---------------------------------------------------------------------------

/**
 * Command issued to a device by an operator or automation system.
 * Published to topic: sf/{siteId}/{deviceId}/cmd
 */
export interface CommandMessage {
  /** Unique command identifier (UUID v4) */
  commandId: string;
  deviceId: string;
  siteId: string;
  action: CommandAction;
  /** Arbitrary action parameters, e.g. { targetTemp: 75, rampRateC: 5 } */
  params: Record<string, unknown>;
  /** User ID of the operator who issued the command */
  issuedBy: string;
  /** Unix epoch milliseconds when command was created */
  issuedAt: number;
  /** Time-to-live in ms; device should ignore expired commands. Default 30000 */
  ttl: number;
}

// ---------------------------------------------------------------------------
// 3. Command ACK message  (device → EMQX → Kafka → API)
// ---------------------------------------------------------------------------

/**
 * Acknowledgement published by the device after receiving and executing a command.
 * Published to topic: sf/{siteId}/{deviceId}/cmd/ack
 */
export interface CommandAckMessage {
  /** Matches the commandId from the original CommandMessage */
  commandId: string;
  deviceId: string;
  status: CommandStatus;
  /** Optional human-readable detail, especially for failures */
  message?: string;
  /** Unix epoch milliseconds when the device executed the command */
  executedAt: number;
}

// ---------------------------------------------------------------------------
// 4. Device status message  (heartbeat every 30s)
// ---------------------------------------------------------------------------

/**
 * Periodic heartbeat published by a device to indicate online/offline state.
 * Published to topic: sf/{siteId}/{deviceId}/status
 * Devices should publish "offline" as an MQTT Last Will message.
 */
export interface DeviceStatusMessage {
  deviceId: string;
  siteId: string;
  status: DeviceOnlineStatus;
  /** Firmware version string, e.g. "1.4.2" */
  firmware?: string;
  /** Wi-Fi/cellular RSSI in dBm (negative; closer to 0 is stronger) */
  rssi?: number;
  /** Unix epoch milliseconds */
  timestamp: number;
}

// ---------------------------------------------------------------------------
// 5. Device alert message  (threshold breach alert from device)
// ---------------------------------------------------------------------------

/**
 * Alert emitted by a device when a sensor reading crosses a configured threshold.
 * Published to topic: sf/{siteId}/alert
 */
export interface DeviceAlertMessage {
  /** Unique alert identifier (UUID v4) */
  alertId: string;
  deviceId: string;
  siteId: string;
  sensorId: string;
  severity: AlertSeverity;
  /** Human-readable description, e.g. "Temperature exceeded 90°C limit" */
  message: string;
  /** Actual sensor value that triggered the alert */
  value: number;
  /** Configured threshold that was breached */
  threshold: number;
  /** Unix epoch milliseconds */
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Factory functions
// ---------------------------------------------------------------------------

/**
 * Create a well-formed TelemetryMessage with auto-generated messageId and timestamp.
 */
export function createTelemetryMessage(
  params: Omit<TelemetryMessage, "messageId" | "timestamp"> &
    Partial<Pick<TelemetryMessage, "messageId" | "timestamp">>
): TelemetryMessage {
  return {
    messageId: params.messageId ?? randomUUID(),
    timestamp: params.timestamp ?? Date.now(),
    deviceId: params.deviceId,
    siteId: params.siteId,
    sensorId: params.sensorId,
    sensorType: params.sensorType,
    value: params.value,
    unit: params.unit,
    quality: params.quality,
  };
}

/**
 * Create a well-formed CommandMessage with auto-generated commandId and issuedAt.
 */
export function createCommandMessage(
  params: Omit<CommandMessage, "commandId" | "issuedAt"> &
    Partial<Pick<CommandMessage, "commandId" | "issuedAt" | "ttl">>
): CommandMessage {
  return {
    commandId: params.commandId ?? randomUUID(),
    issuedAt: params.issuedAt ?? Date.now(),
    ttl: params.ttl ?? 30_000,
    deviceId: params.deviceId,
    siteId: params.siteId,
    action: params.action,
    params: params.params,
    issuedBy: params.issuedBy,
  };
}

/**
 * Create a well-formed CommandAckMessage with auto-generated executedAt.
 */
export function createCommandAck(
  params: Omit<CommandAckMessage, "executedAt"> &
    Partial<Pick<CommandAckMessage, "executedAt">>
): CommandAckMessage {
  return {
    executedAt: params.executedAt ?? Date.now(),
    commandId: params.commandId,
    deviceId: params.deviceId,
    status: params.status,
    message: params.message,
  };
}

// ---------------------------------------------------------------------------
// Runtime validation helpers
// ---------------------------------------------------------------------------

const VALID_SENSOR_TYPES = new Set<string>([
  "temperature",
  "humidity",
  "pressure",
  "vibration",
  "power",
  "flow",
  "level",
  "gas",
]);

const VALID_QUALITY = new Set<string>(["good", "uncertain", "bad"]);
const VALID_ACTIONS = new Set<string>(["start", "stop", "restart", "adjust", "calibrate"]);
const VALID_CMD_STATUS = new Set<string>(["success", "failed", "timeout"]);
const VALID_SEVERITIES = new Set<string>(["info", "warning", "critical"]);

/** Returns true if `obj` is a structurally valid TelemetryMessage. */
export function isTelemetryMessage(obj: unknown): obj is TelemetryMessage {
  if (typeof obj !== "object" || obj === null) return false;
  const m = obj as Record<string, unknown>;
  return (
    typeof m["messageId"] === "string" &&
    typeof m["deviceId"] === "string" &&
    typeof m["siteId"] === "string" &&
    typeof m["sensorId"] === "string" &&
    typeof m["sensorType"] === "string" &&
    VALID_SENSOR_TYPES.has(m["sensorType"] as string) &&
    typeof m["value"] === "number" &&
    typeof m["unit"] === "string" &&
    typeof m["quality"] === "string" &&
    VALID_QUALITY.has(m["quality"] as string) &&
    typeof m["timestamp"] === "number"
  );
}

/** Returns true if `obj` is a structurally valid CommandMessage. */
export function isCommandMessage(obj: unknown): obj is CommandMessage {
  if (typeof obj !== "object" || obj === null) return false;
  const m = obj as Record<string, unknown>;
  return (
    typeof m["commandId"] === "string" &&
    typeof m["deviceId"] === "string" &&
    typeof m["siteId"] === "string" &&
    typeof m["action"] === "string" &&
    VALID_ACTIONS.has(m["action"] as string) &&
    typeof m["params"] === "object" &&
    m["params"] !== null &&
    typeof m["issuedBy"] === "string" &&
    typeof m["issuedAt"] === "number" &&
    typeof m["ttl"] === "number"
  );
}

/** Returns true if `obj` is a structurally valid CommandAckMessage. */
export function isCommandAckMessage(obj: unknown): obj is CommandAckMessage {
  if (typeof obj !== "object" || obj === null) return false;
  const m = obj as Record<string, unknown>;
  return (
    typeof m["commandId"] === "string" &&
    typeof m["deviceId"] === "string" &&
    typeof m["status"] === "string" &&
    VALID_CMD_STATUS.has(m["status"] as string) &&
    typeof m["executedAt"] === "number"
  );
}

/** Returns true if `obj` is a structurally valid DeviceStatusMessage. */
export function isDeviceStatusMessage(obj: unknown): obj is DeviceStatusMessage {
  if (typeof obj !== "object" || obj === null) return false;
  const m = obj as Record<string, unknown>;
  return (
    typeof m["deviceId"] === "string" &&
    typeof m["siteId"] === "string" &&
    (m["status"] === "online" || m["status"] === "offline") &&
    typeof m["timestamp"] === "number"
  );
}

/** Returns true if `obj` is a structurally valid DeviceAlertMessage. */
export function isDeviceAlertMessage(obj: unknown): obj is DeviceAlertMessage {
  if (typeof obj !== "object" || obj === null) return false;
  const m = obj as Record<string, unknown>;
  return (
    typeof m["alertId"] === "string" &&
    typeof m["deviceId"] === "string" &&
    typeof m["siteId"] === "string" &&
    typeof m["sensorId"] === "string" &&
    typeof m["severity"] === "string" &&
    VALID_SEVERITIES.has(m["severity"] as string) &&
    typeof m["message"] === "string" &&
    typeof m["value"] === "number" &&
    typeof m["threshold"] === "number" &&
    typeof m["timestamp"] === "number"
  );
}

// ---------------------------------------------------------------------------
// Kafka topic mapping
// ---------------------------------------------------------------------------

/** Maps a message type to its Kafka topic name. */
export const KAFKA_TOPICS = {
  telemetry: "sf.telemetry",
  alerts: "sf.alerts",
  commands: "sf.commands",
  commandAck: "sf.cmd-ack",
  deviceStatus: "sf.device-status",
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];
