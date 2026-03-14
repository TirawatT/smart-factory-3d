# Smart Factory — Message Broker Infrastructure

Complete local-development stack for the Smart Factory IoT platform:
**EMQX 5.5 (MQTT)** → **Kafka 7.6** → **TimescaleDB (PostgreSQL 16)** + **Redis 7.2**

---

## Prerequisites

| Tool | Minimum version | Notes |
|------|----------------|-------|
| Docker Desktop | 4.x | With Compose v2 (`docker compose`) |
| Node.js | 20 LTS | For the sensor simulator |
| npm | 9+ | Bundled with Node |

---

## Quick Start

### 1. Start the infrastructure stack

```bash
# From the repo root
cd infra
docker compose up -d
```

Wait ~30 seconds for all services to initialise (Kafka is the slowest to start).

Check that all containers are healthy:

```bash
docker compose ps
```

All services should show `healthy` or `running`.

### 2. Verify Kafka topics were created

```bash
docker exec sf-kafka kafka-topics --bootstrap-server localhost:9092 --list
```

Expected output:
```
sf.alerts
sf.cmd-ack
sf.commands
sf.device-status
sf.telemetry
```

### 3. Start the sensor simulator

```bash
cd ../edge/simulator
npm install
npm start
```

You should see telemetry lines like:

```
[sim-dev-001] temperature      72.14 °C       → sf/site-01/building-A/floor-1/dev-001/telemetry/temperature
[sim-dev-001] pressure          4.48 bar      → sf/site-01/building-A/floor-1/dev-001/telemetry/pressure
...
```

Press **Ctrl+C** to stop gracefully (devices publish an offline status before disconnecting).

---

## Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| EMQX Dashboard | http://localhost:18083 | admin / SmartFactory2026! |
| Kafka UI | http://localhost:8080 | (no auth) |
| PostgreSQL | localhost:5432 | sfadmin / SmartFactory2026! / db: smartfactory |
| Redis | localhost:6379 | password: SmartFactory2026! |
| EMQX MQTT (TCP) | mqtt://localhost:1883 | anonymous in dev |
| EMQX MQTT (WS) | ws://localhost:8083/mqtt | anonymous in dev |

---

## MQTT Topic Cheatsheet

```
PUBLISH (device → broker):
  sf/{siteId}/{buildingId}/{floorId}/{deviceId}/telemetry/{sensorType}
  sf/{siteId}/{deviceId}/status
  sf/{siteId}/{deviceId}/cmd/ack
  sf/{siteId}/alert

SUBSCRIBE (backend → broker):
  sf/{siteId}/+/+/+/telemetry/+   ← all telemetry on a site
  sf/{siteId}/+/status             ← all heartbeats on a site
  sf/{siteId}/alert                ← all device alerts on a site
  sf/{siteId}/+/cmd/ack            ← all command ACKs on a site

PUBLISH (backend → device):
  sf/{siteId}/{deviceId}/cmd
```

Sensor types: `temperature` | `humidity` | `pressure` | `vibration` | `power` | `flow` | `level` | `gas`

---

## Kafka Topics

| Topic | Partitions | Retention | Purpose |
|-------|-----------|-----------|---------|
| `sf.telemetry` | 12 | 7 days | Raw sensor readings |
| `sf.alerts` | 4 | 30 days | Device threshold alerts |
| `sf.commands` | 4 | 1 day | Commands to devices |
| `sf.cmd-ack` | 4 | 1 day | Command acknowledgements |
| `sf.device-status` | 4 | 7 days | Online/offline heartbeats |

Partitioning key: use `deviceId` as the Kafka message key to ensure ordering per device.

---

## Frontend WebSocket Connection

Connect the browser/Next.js frontend to EMQX using MQTT over WebSocket:

```typescript
import mqtt from "mqtt";

const client = mqtt.connect("ws://localhost:8083/mqtt", {
  clientId: `dashboard-${Math.random().toString(16).slice(2)}`,
  clean: true,
  reconnectPeriod: 3000,
});

client.on("connect", () => {
  // Subscribe to all telemetry for site-01
  client.subscribe("sf/site-01/+/+/+/telemetry/+", { qos: 0 });
  // Subscribe to all alerts
  client.subscribe("sf/site-01/alert", { qos: 1 });
});

client.on("message", (topic, payload) => {
  const message = JSON.parse(payload.toString());
  console.log(topic, message);
});
```

---

## Data Flow

```
IoT Device / Simulator
       │
       │  MQTT (QoS 0/1)
       ▼
   EMQX 5.5  ──────────────────────────────────────────────────────────────┐
       │                                                                    │
       │  EMQX Kafka Bridge (configure in EMQX Dashboard → Data Bridge)    │
       ▼                                                                    │
  Kafka Cluster                                                             │
  ┌─────────────────────────────────────────────────────┐                  │
  │  sf.telemetry  sf.alerts  sf.commands  sf.device-status│                │
  └───────────────────┬──────────────────────────────────┘                  │
                      │                                                    │
                      │  Kafka Consumer (backend)                          │
                      ▼                                                    │
              Next.js API / Worker                                         │
              ┌──────────┬──────────┐                                      │
              │TimescaleDB│  Redis   │                                      │
              │(telemetry)│(realtime)│                                      │
              └──────────┴──────────┘                                      │
                      │                                                    │
                      │  WebSocket / SSE                                   │
                      ▼                                                    │
              Browser Dashboard  ◄────────────────────────────────────────┘
                                   Direct MQTT/WS (optional)
```

---

## ACL / Client Roles

| Client ID prefix | Role | Permissions |
|-----------------|------|-------------|
| `sim-*` | Simulator | Publish anywhere under `sf/#` |
| `dev-*` | Physical device | Publish own telemetry/status/alert; subscribe own cmd |
| `backend-*` | Backend service | Subscribe `sf/#`; publish commands |
| `dashboard` | Web dashboard | Subscribe `sf/#`; publish commands |
| `admin` | Admin | Full access |

---

## Stopping the Stack

```bash
# Stop all services (data is preserved in Docker volumes)
cd infra
docker compose down

# Stop and remove all data volumes (full reset)
docker compose down -v
```

---

## Troubleshooting

### EMQX won't start
- Check logs: `docker logs sf-emqx`
- Ensure port 1883 and 18083 are not already in use
- Verify `infra/emqx/emqx.conf` syntax is valid

### Kafka topics not created
- `kafka-init` runs once; if it fails, re-run: `docker compose restart kafka-init`
- Check logs: `docker logs sf-kafka-init`

### Simulator cannot connect
- Confirm EMQX is running: `docker compose ps sf-emqx`
- Test connectivity: `mosquitto_pub -h localhost -p 1883 -t test -m hello` (requires mosquitto-clients)
- Check EMQX is in anonymous mode (dev default)

### TimescaleDB extension missing
- The `timescale/timescaledb:latest-pg16` image includes the extension
- If `init.sql` fails, check logs: `docker logs sf-postgres`
- Manual fix: `docker exec -it sf-postgres psql -U sfadmin -d smartfactory -c "CREATE EXTENSION timescaledb;"`

### Redis auth errors
- All Redis commands require the password: `redis-cli -a SmartFactory2026! ping`

---

## File Structure

```
infra/
├── docker-compose.yml      ← full stack definition
├── emqx/
│   ├── emqx.conf           ← EMQX 5.x broker configuration
│   └── acl.conf            ← MQTT access control rules
├── postgres/
│   └── init.sql            ← TimescaleDB schema + hypertable setup
└── README.md               ← this file

lib/
├── mqtt/
│   └── topics.ts           ← MQTT topic constants and helpers
└── schemas/
    └── telemetry.ts        ← TypeScript interfaces and factory functions

edge/
└── simulator/
    ├── index.ts            ← sensor simulator (8 devices × 2-3 sensors)
    ├── package.json
    └── tsconfig.json
```
