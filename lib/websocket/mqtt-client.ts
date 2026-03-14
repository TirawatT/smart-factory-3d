/**
 * Singleton MQTT client for browser-side WebSocket connections to EMQX.
 * NOT a "use client" module — plain TypeScript module imported by hooks.
 */

import mqtt from "mqtt";

const BROKER_URL =
  process.env.NEXT_PUBLIC_MQTT_URL ?? "ws://localhost:8083/mqtt";

// ---------------------------------------------------------------------------
// Wildcard topic matching
// ---------------------------------------------------------------------------

/**
 * Match an MQTT topic against a pattern that may contain + and # wildcards.
 * + matches exactly one level; # matches zero or more levels at the end.
 */
function matchTopic(pattern: string, topic: string): boolean {
  const patternParts = pattern.split("/");
  const topicParts = topic.split("/");

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];

    if (p === "#") {
      // # matches everything remaining (including zero levels)
      return true;
    }

    if (i >= topicParts.length) {
      return false;
    }

    if (p !== "+" && p !== topicParts[i]) {
      return false;
    }
  }

  return patternParts.length === topicParts.length;
}

// ---------------------------------------------------------------------------
// MqttClient class
// ---------------------------------------------------------------------------

type MessageHandler = (payload: unknown, topic: string) => void;

export class MqttClient {
  private client: mqtt.MqttClient | null = null;
  private subscriptions: Map<string, Set<MessageHandler>> = new Map();

  // ----- Connection management -----

  connect(): void {
    // Only connect in the browser
    if (typeof window === "undefined") return;
    if (this.client) return;

    const clientId = `sf-dashboard-${Math.random().toString(16).slice(2, 10)}`;

    this.client = mqtt.connect(BROKER_URL, {
      clientId,
      reconnectPeriod: 3000,
      clean: true,
      connectTimeout: 10_000,
    });

    this.client.on("connect", () => {
      // Re-subscribe to all registered topics after (re)connect
      for (const topic of this.subscriptions.keys()) {
        this.client?.subscribe(topic, { qos: 0 }, (err) => {
          if (err) {
            console.warn(`[MqttClient] Failed to subscribe to ${topic}:`, err);
          }
        });
      }
    });

    this.client.on("message", (topic: string, buffer: Buffer) => {
      let payload: unknown;
      try {
        payload = JSON.parse(buffer.toString("utf8"));
      } catch {
        payload = buffer.toString("utf8");
      }

      // Call all handlers whose pattern matches the received topic
      for (const [pattern, handlers] of this.subscriptions.entries()) {
        if (matchTopic(pattern, topic)) {
          for (const handler of handlers) {
            try {
              handler(payload, topic);
            } catch (err) {
              console.error(`[MqttClient] Handler error for ${pattern}:`, err);
            }
          }
        }
      }
    });

    this.client.on("error", (err) => {
      console.warn("[MqttClient] Connection error:", err.message);
    });
  }

  disconnect(): void {
    if (!this.client) return;
    this.client.end(true);
    this.client = null;
  }

  // ----- Subscribe / Unsubscribe -----

  /**
   * Subscribe to a topic (may include + and # wildcards).
   * Returns an unsubscribe function.
   */
  subscribe(topic: string, handler: MessageHandler): () => void {
    if (!this.subscriptions.has(topic)) {
      this.subscriptions.set(topic, new Set());

      // If already connected, subscribe immediately
      if (this.client?.connected) {
        this.client.subscribe(topic, { qos: 0 }, (err) => {
          if (err) {
            console.warn(`[MqttClient] Failed to subscribe to ${topic}:`, err);
          }
        });
      }
    }

    this.subscriptions.get(topic)!.add(handler);

    return () => {
      const handlers = this.subscriptions.get(topic);
      if (!handlers) return;
      handlers.delete(handler);

      if (handlers.size === 0) {
        this.subscriptions.delete(topic);
        if (this.client?.connected) {
          this.client.unsubscribe(topic);
        }
      }
    };
  }

  // ----- Publish -----

  publish(topic: string, payload: unknown): void {
    if (!this.client?.connected) {
      console.warn("[MqttClient] Cannot publish — not connected");
      return;
    }
    this.client.publish(topic, JSON.stringify(payload), { qos: 0 });
  }

  // ----- Status -----

  isConnected(): boolean {
    return this.client?.connected === true;
  }

  /** Returns whether the client is currently in a connecting/reconnecting state. */
  isConnecting(): boolean {
    if (!this.client) return false;
    // mqtt.js exposes reconnecting flag
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.client as any).reconnecting === true || !this.client.connected;
  }

  /** Register a one-time listener for connection/disconnection events. */
  onConnectionChange(cb: (connected: boolean) => void): () => void {
    if (!this.client) return () => {};

    const onConnect = () => cb(true);
    const onOffline = () => cb(false);
    const onClose = () => cb(false);

    this.client.on("connect", onConnect);
    this.client.on("offline", onOffline);
    this.client.on("close", onClose);

    return () => {
      this.client?.off("connect", onConnect);
      this.client?.off("offline", onOffline);
      this.client?.off("close", onClose);
    };
  }
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------

export const mqttClient = new MqttClient();
