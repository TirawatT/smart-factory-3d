"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { WILDCARDS, parseTelemetryTopic } from "@/lib/mqtt/topics";
import { TelemetryMessage, isTelemetryMessage } from "@/lib/schemas/telemetry";
import { mqttClient } from "@/lib/websocket/mqtt-client";
import { SensorReading } from "@/lib/types";

// ---------------------------------------------------------------------------
// useLiveTelemetry — per-device live sensor readings
// ---------------------------------------------------------------------------

export interface LiveTelemetryResult {
  /** Rolling window of readings per sensorId */
  readings: Map<string, SensorReading[]>;
  /** Latest value per sensorId */
  latestValues: Map<string, number>;
  isLive: boolean;
}

/**
 * Subscribe to live telemetry for a specific device.
 * Uses the site-wide wildcard and filters for the given deviceId.
 * Keeps a rolling window of `maxReadings` per sensor.
 */
export function useLiveTelemetry(
  deviceId: string,
  siteId = "site-01",
  maxReadings = 60
): LiveTelemetryResult {
  const [readings, setReadings] = useState<Map<string, SensorReading[]>>(
    () => new Map()
  );
  const [latestValues, setLatestValues] = useState<Map<string, number>>(
    () => new Map()
  );
  const [isLive, setIsLive] = useState(false);

  // Keep a mutable ref so the handler closure always sees the latest state
  const readingsRef = useRef<Map<string, SensorReading[]>>(new Map());

  const handleMessage = useCallback(
    (payload: unknown, _topic: string) => {
      if (!isTelemetryMessage(payload)) return;
      const msg = payload as TelemetryMessage;
      if (msg.deviceId !== deviceId) return;

      const reading: SensorReading = {
        sensorId: msg.sensorId,
        deviceId: msg.deviceId,
        value: msg.value,
        timestamp: msg.timestamp,
      };

      const prev = readingsRef.current;
      const sensorReadings = prev.get(msg.sensorId) ?? [];
      const updated = [...sensorReadings, reading].slice(-maxReadings);

      const nextMap = new Map(prev);
      nextMap.set(msg.sensorId, updated);
      readingsRef.current = nextMap;

      setReadings(new Map(nextMap));
      setLatestValues((lv) => new Map(lv).set(msg.sensorId, msg.value));
      setIsLive(true);
    },
    [deviceId, maxReadings]
  );

  useEffect(() => {
    if (!deviceId) return;

    mqttClient.connect();

    const topic = WILDCARDS.allTelemetry(siteId);
    const unsubscribe = mqttClient.subscribe(topic, handleMessage);

    return () => {
      unsubscribe();
    };
  }, [deviceId, siteId, handleMessage]);

  return { readings, latestValues, isLive };
}

// ---------------------------------------------------------------------------
// useLiveSiteTelemetry — site-wide latest values map
// ---------------------------------------------------------------------------

export interface LiveSiteTelemetryResult {
  /** deviceId → (sensorType → latest value) */
  latestByDevice: Map<string, Map<string, number>>;
  isLive: boolean;
}

/**
 * Subscribe to ALL telemetry for a site.
 * Maintains a nested map of deviceId → sensorType → latest value.
 */
export function useLiveSiteTelemetry(siteId = "site-01"): LiveSiteTelemetryResult {
  const [latestByDevice, setLatestByDevice] = useState<
    Map<string, Map<string, number>>
  >(() => new Map());
  const [isLive, setIsLive] = useState(false);

  const latestRef = useRef<Map<string, Map<string, number>>>(new Map());

  const handleMessage = useCallback((payload: unknown, topic: string) => {
    if (!isTelemetryMessage(payload)) return;
    const msg = payload as TelemetryMessage;

    const parsed = parseTelemetryTopic(topic);
    const sensorType = parsed?.sensorType ?? msg.sensorId;

    const prev = latestRef.current;
    const deviceMap = prev.get(msg.deviceId) ?? new Map<string, number>();
    const nextDeviceMap = new Map(deviceMap).set(sensorType, msg.value);
    const nextMap = new Map(prev).set(msg.deviceId, nextDeviceMap);

    latestRef.current = nextMap;
    setLatestByDevice(new Map(nextMap));
    setIsLive(true);
  }, []);

  useEffect(() => {
    mqttClient.connect();

    const topic = WILDCARDS.allTelemetry(siteId);
    const unsubscribe = mqttClient.subscribe(topic, handleMessage);

    return () => {
      unsubscribe();
    };
  }, [siteId, handleMessage]);

  return { latestByDevice, isLive };
}
