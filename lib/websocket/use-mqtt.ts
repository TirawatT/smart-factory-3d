"use client";

import { useEffect, useState } from "react";
import { mqttClient } from "@/lib/websocket/mqtt-client";

export interface MqttStatus {
  connected: boolean;
  connecting: boolean;
}

/**
 * Hook that tracks MQTT connection status.
 * Triggers mqttClient.connect() on mount and cleans up on unmount.
 */
export function useMqttStatus(): MqttStatus {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Trigger connection
    mqttClient.connect();

    // Set initial state
    setConnected(mqttClient.isConnected());
    setConnecting(!mqttClient.isConnected());

    // Listen for state changes
    const unsubscribe = mqttClient.onConnectionChange((isConnected) => {
      setConnected(isConnected);
      setConnecting(false);
    });

    // Poll briefly to catch the connecting→connected transition
    const poll = setInterval(() => {
      const isConn = mqttClient.isConnected();
      setConnected(isConn);
      if (isConn) {
        setConnecting(false);
        clearInterval(poll);
      }
    }, 500);

    return () => {
      clearInterval(poll);
      unsubscribe();
    };
  }, []);

  return { connected, connecting: connecting && !connected };
}
