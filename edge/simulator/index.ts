/**
 * Smart Factory — Sensor Simulator
 *
 * Simulates 8 industrial devices, each publishing realistic sensor telemetry
 * via MQTT to EMQX every 3 seconds. Device heartbeats are sent every 30 seconds.
 *
 * Usage:
 *   npm start          — run with ts-node
 *   npm run dev        — run with ts-node-dev (auto-restart on change)
 *
 * Environment variables (optional):
 *   MQTT_BROKER   — broker URL (default: mqtt://localhost:1883)
 *   SITE_ID       — site identifier (default: site-01)
 *   BUILDING_ID   — building identifier (default: building-A)
 *   FLOOR_ID      — floor identifier (default: floor-1)
 */

import mqtt, { MqttClient } from "mqtt";
import { v4 as uuidv4 } from "uuid";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const MQTT_BROKER  = process.env["MQTT_BROKER"]   ?? "mqtt://localhost:1883";
const SITE_ID      = process.env["SITE_ID"]        ?? "site-01";
const BUILDING_ID  = process.env["BUILDING_ID"]    ?? "building-A";
const FLOOR_ID     = process.env["FLOOR_ID"]       ?? "floor-1";

const TELEMETRY_INTERVAL_MS = 3_000;   // publish sensor readings every 3 s
const HEARTBEAT_INTERVAL_MS = 30_000;  // publish device status every 30 s
const SPIKE_PROBABILITY      = 0.05;   // 5% chance of a spike on any given reading
const SPIKE_OVERSHOOT        = 0.20;   // spike = 20% above the sensor's max value

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SensorDef {
  sensorId: string;
  sensorType: string;
  unit: string;
  baseline: number;
  min: number;
  max: number;
  /** Current simulated value — mutated during simulation */
  current?: number;
}

interface DeviceDef {
  deviceId: string;
  name: string;
  firmware: string;
  sensors: SensorDef[];
}

// ---------------------------------------------------------------------------
// Simulated device fleet
// ---------------------------------------------------------------------------
const DEVICES: DeviceDef[] = [
  {
    deviceId: "dev-001",
    name: "Compressor A1",
    firmware: "1.4.2",
    sensors: [
      { sensorId: "dev-001-temp",  sensorType: "temperature", unit: "°C",  baseline: 72,  min: 60, max: 90 },
      { sensorId: "dev-001-pres",  sensorType: "pressure",    unit: "bar", baseline: 4.5, min: 3,  max: 6  },
    ],
  },
  {
    deviceId: "dev-002",
    name: "Cooling Tower B1",
    firmware: "2.1.0",
    sensors: [
      { sensorId: "dev-002-temp", sensorType: "temperature", unit: "°C", baseline: 35, min: 28, max: 45 },
      { sensorId: "dev-002-hum",  sensorType: "humidity",    unit: "%",  baseline: 65, min: 50, max: 80 },
    ],
  },
  {
    deviceId: "dev-003",
    name: "Pump Station C1",
    firmware: "1.2.5",
    sensors: [
      { sensorId: "dev-003-flow", sensorType: "flow",     unit: "L/min", baseline: 120, min: 80, max: 160 },
      { sensorId: "dev-003-pres", sensorType: "pressure", unit: "bar",   baseline: 3.2, min: 2,  max: 5   },
    ],
  },
  {
    deviceId: "dev-004",
    name: "Power Panel D1",
    firmware: "3.0.1",
    sensors: [
      { sensorId: "dev-004-pwr", sensorType: "power",     unit: "kW",   baseline: 85, min: 60, max: 110 },
      { sensorId: "dev-004-vib", sensorType: "vibration", unit: "mm/s", baseline: 2.1, min: 0, max: 5   },
    ],
  },
  {
    deviceId: "dev-005",
    name: "Furnace E1",
    firmware: "1.8.3",
    sensors: [
      { sensorId: "dev-005-temp", sensorType: "temperature", unit: "°C", baseline: 850, min: 750, max: 950 },
      { sensorId: "dev-005-gas",  sensorType: "gas",         unit: "%",  baseline: 45,  min: 30,  max: 60  },
    ],
  },
  {
    deviceId: "dev-006",
    name: "Conveyor F1",
    firmware: "2.3.0",
    sensors: [
      { sensorId: "dev-006-vib", sensorType: "vibration", unit: "mm/s", baseline: 1.8, min: 0,  max: 4  },
      { sensorId: "dev-006-pwr", sensorType: "power",     unit: "kW",   baseline: 22,  min: 15, max: 35 },
    ],
  },
  {
    deviceId: "dev-007",
    name: "Robot Arm G1",
    firmware: "4.0.0",
    sensors: [
      { sensorId: "dev-007-temp", sensorType: "temperature", unit: "°C",   baseline: 45, min: 35, max: 60 },
      { sensorId: "dev-007-vib",  sensorType: "vibration",   unit: "mm/s", baseline: 3.2, min: 0, max: 8  },
    ],
  },
  {
    deviceId: "dev-008",
    name: "Air Handler H1",
    firmware: "1.6.1",
    sensors: [
      { sensorId: "dev-008-temp", sensorType: "temperature", unit: "°C", baseline: 22, min: 18, max: 28 },
      { sensorId: "dev-008-hum",  sensorType: "humidity",    unit: "%",  baseline: 55, min: 40, max: 70 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Topic helpers (inline — avoids dependency on lib/mqtt)
// ---------------------------------------------------------------------------
function telemetryTopic(deviceId: string, sensorType: string): string {
  return `sf/${SITE_ID}/${BUILDING_ID}/${FLOOR_ID}/${deviceId}/telemetry/${sensorType}`;
}

function statusTopic(deviceId: string): string {
  return `sf/${SITE_ID}/${deviceId}/status`;
}

// ---------------------------------------------------------------------------
// Value simulation
// ---------------------------------------------------------------------------

/**
 * Initialise all sensor current values to their baseline.
 */
function initCurrentValues(): void {
  for (const device of DEVICES) {
    for (const sensor of device.sensors) {
      sensor.current = sensor.baseline;
    }
  }
}

/**
 * Walk the sensor value one step using a random walk clamped to [min, max].
 * 5% chance of a spike 20% above the sensor's configured max.
 */
function nextValue(sensor: SensorDef): number {
  const range = sensor.max - sensor.min;
  const stepSize = range * 0.02; // max 2% of range per step

  // Random spike
  if (Math.random() < SPIKE_PROBABILITY) {
    return sensor.max * (1 + SPIKE_OVERSHOOT);
  }

  // Random walk
  const delta = (Math.random() - 0.5) * 2 * stepSize;
  const next = (sensor.current ?? sensor.baseline) + delta;

  // Clamp to [min, max]
  sensor.current = Math.min(sensor.max, Math.max(sensor.min, next));
  return sensor.current;
}

/**
 * Assess data quality based on how far the value is from the normal range.
 */
function qualityFor(value: number, sensor: SensorDef): "good" | "uncertain" | "bad" {
  if (value > sensor.max || value < sensor.min) return "uncertain";
  const margin = (sensor.max - sensor.min) * 0.05;
  if (value > sensor.max - margin || value < sensor.min + margin) return "uncertain";
  return "good";
}

// ---------------------------------------------------------------------------
// MQTT client setup
// ---------------------------------------------------------------------------

function buildLastWill(deviceId: string): mqtt.IClientOptions["will"] {
  return {
    topic:   statusTopic(deviceId),
    payload: JSON.stringify({
      deviceId,
      siteId:    SITE_ID,
      status:    "offline",
      timestamp: Date.now(),
    }),
    qos:    1,
    retain: true,
  };
}

/**
 * Create an MQTT client for a specific device.
 * Each device uses its own connection with a unique clientId.
 */
function createDeviceClient(device: DeviceDef): MqttClient {
  const clientId = `sim-${device.deviceId}`;
  const client = mqtt.connect(MQTT_BROKER, {
    clientId,
    clean:      true,
    keepalive:  60,
    reconnectPeriod: 5_000,
    will: buildLastWill(device.deviceId),
  });

  client.on("connect", () => {
    console.log(`[${clientId}] Connected to ${MQTT_BROKER}`);
    publishHeartbeat(client, device, "online");
  });

  client.on("error", (err) => {
    console.error(`[${clientId}] MQTT error:`, err.message);
  });

  client.on("reconnect", () => {
    console.log(`[${clientId}] Reconnecting...`);
  });

  return client;
}

// ---------------------------------------------------------------------------
// Publishers
// ---------------------------------------------------------------------------

function publishTelemetry(client: MqttClient, device: DeviceDef): void {
  for (const sensor of device.sensors) {
    const value = nextValue(sensor);
    const topic = telemetryTopic(device.deviceId, sensor.sensorType);

    const payload = JSON.stringify({
      messageId:  uuidv4(),
      deviceId:   device.deviceId,
      siteId:     SITE_ID,
      sensorId:   sensor.sensorId,
      sensorType: sensor.sensorType,
      value:      parseFloat(value.toFixed(3)),
      unit:       sensor.unit,
      quality:    qualityFor(value, sensor),
      timestamp:  Date.now(),
    });

    client.publish(topic, payload, { qos: 0 }, (err) => {
      if (err) {
        console.error(`[sim-${device.deviceId}] Publish error on ${topic}:`, err.message);
        return;
      }
      console.log(
        `[sim-${device.deviceId}] ${sensor.sensorType.padEnd(12)} ` +
        `${value.toFixed(2).padStart(8)} ${sensor.unit.padEnd(6)}  → ${topic}`
      );
    });
  }
}

function publishHeartbeat(
  client: MqttClient,
  device: DeviceDef,
  status: "online" | "offline"
): void {
  const topic = statusTopic(device.deviceId);
  const payload = JSON.stringify({
    deviceId:  device.deviceId,
    siteId:    SITE_ID,
    status,
    firmware:  device.firmware,
    timestamp: Date.now(),
  });

  client.publish(topic, payload, { qos: 1, retain: true }, (err) => {
    if (err) {
      console.error(`[sim-${device.deviceId}] Heartbeat publish error:`, err.message);
      return;
    }
    console.log(`[sim-${device.deviceId}] Heartbeat → ${status}`);
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  console.log("=".repeat(70));
  console.log("  Smart Factory Sensor Simulator");
  console.log(`  Broker  : ${MQTT_BROKER}`);
  console.log(`  Site    : ${SITE_ID} / ${BUILDING_ID} / ${FLOOR_ID}`);
  console.log(`  Devices : ${DEVICES.length}`);
  console.log(`  Interval: ${TELEMETRY_INTERVAL_MS / 1000}s telemetry, ${HEARTBEAT_INTERVAL_MS / 1000}s heartbeat`);
  console.log("=".repeat(70));

  initCurrentValues();

  // Create one MQTT client per device
  const clients: Array<{ client: MqttClient; device: DeviceDef }> = DEVICES.map((device) => ({
    client: createDeviceClient(device),
    device,
  }));

  // Telemetry loop — publish every 3 s
  const telemetryTimer = setInterval(() => {
    for (const { client, device } of clients) {
      if (client.connected) {
        publishTelemetry(client, device);
      }
    }
  }, TELEMETRY_INTERVAL_MS);

  // Heartbeat loop — publish every 30 s
  const heartbeatTimer = setInterval(() => {
    for (const { client, device } of clients) {
      if (client.connected) {
        publishHeartbeat(client, device, "online");
      }
    }
  }, HEARTBEAT_INTERVAL_MS);

  // Graceful shutdown
  const shutdown = (signal: string): void => {
    console.log(`\nReceived ${signal} — shutting down gracefully...`);
    clearInterval(telemetryTimer);
    clearInterval(heartbeatTimer);

    // Publish offline status for each device then disconnect
    let remaining = clients.length;
    for (const { client, device } of clients) {
      if (client.connected) {
        publishHeartbeat(client, device, "offline");
        // Small delay to let the offline message flush
        setTimeout(() => {
          client.end(false, {}, () => {
            remaining -= 1;
            if (remaining === 0) {
              console.log("All clients disconnected. Goodbye.");
              process.exit(0);
            }
          });
        }, 200);
      } else {
        remaining -= 1;
        if (remaining === 0) {
          console.log("All clients disconnected. Goodbye.");
          process.exit(0);
        }
      }
    }

    // Force exit after 5 s if something hangs
    setTimeout(() => process.exit(1), 5_000);
  };

  process.on("SIGINT",  () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main();
