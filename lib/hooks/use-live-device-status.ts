"use client";

import { useEffect, useState, useCallback } from "react";
import { DeviceStatusMessage, isDeviceStatusMessage } from "@/lib/schemas/telemetry";
import { WILDCARDS } from "@/lib/mqtt/topics";
import { mqttClient } from "@/lib/websocket/mqtt-client";

export interface LiveDeviceStatusResult {
  /** deviceId → "online" | "offline" */
  statusMap: Map<string, "online" | "offline">;
  isLive: boolean;
}

/**
 * Subscribe to device heartbeat/status messages for a site.
 * Updates the status map each time a heartbeat arrives.
 */
export function useLiveDeviceStatus(siteId = "site-01"): LiveDeviceStatusResult {
  const [statusMap, setStatusMap] = useState<Map<string, "online" | "offline">>(
    () => new Map()
  );
  const [isLive, setIsLive] = useState(false);

  const handleMessage = useCallback((payload: unknown, _topic: string) => {
    if (!isDeviceStatusMessage(payload)) return;
    const msg = payload as DeviceStatusMessage;

    setStatusMap((prev) =>
      new Map(prev).set(msg.deviceId, msg.status)
    );
    setIsLive(true);
  }, []);

  useEffect(() => {
    mqttClient.connect();

    const topic = WILDCARDS.allStatus(siteId);
    const unsubscribe = mqttClient.subscribe(topic, handleMessage);

    return () => {
      unsubscribe();
    };
  }, [siteId, handleMessage]);

  return { statusMap, isLive };
}
