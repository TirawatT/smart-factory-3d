"use client";

import { useEffect, useState, useCallback } from "react";
import { DeviceAlertMessage, isDeviceAlertMessage } from "@/lib/schemas/telemetry";
import { WILDCARDS } from "@/lib/mqtt/topics";
import { mqttClient } from "@/lib/websocket/mqtt-client";

const MAX_ALERTS = 50;

export interface LiveAlertsResult {
  /** Newest-first, capped at 50 */
  liveAlerts: DeviceAlertMessage[];
  /** Count of new alerts since last clearNewCount() */
  newAlertCount: number;
  clearNewCount: () => void;
  isLive: boolean;
}

/**
 * Subscribe to real-time device alerts for a site.
 * Prepends each new alert, keeps at most 50 entries.
 */
export function useLiveAlerts(siteId = "site-01"): LiveAlertsResult {
  const [liveAlerts, setLiveAlerts] = useState<DeviceAlertMessage[]>([]);
  const [newAlertCount, setNewAlertCount] = useState(0);
  const [isLive, setIsLive] = useState(false);

  const handleMessage = useCallback((payload: unknown, _topic: string) => {
    if (!isDeviceAlertMessage(payload)) return;
    const alert = payload as DeviceAlertMessage;

    setLiveAlerts((prev) => [alert, ...prev].slice(0, MAX_ALERTS));
    setNewAlertCount((n) => n + 1);
    setIsLive(true);
  }, []);

  const clearNewCount = useCallback(() => setNewAlertCount(0), []);

  useEffect(() => {
    mqttClient.connect();

    const topic = WILDCARDS.allAlerts(siteId);
    const unsubscribe = mqttClient.subscribe(topic, handleMessage);

    return () => {
      unsubscribe();
    };
  }, [siteId, handleMessage]);

  return { liveAlerts, newAlertCount, clearNewCount, isLive };
}
