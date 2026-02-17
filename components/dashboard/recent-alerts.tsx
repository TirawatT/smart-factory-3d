"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertSeverity } from "@/lib/types";
import { useRealtimeStore } from "@/stores/realtime-store";
import { format } from "date-fns";
import { Check } from "lucide-react";

const severityStyles: Record<AlertSeverity, string> = {
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export function RecentAlerts() {
  const alerts = useRealtimeStore((s) => s.alerts);
  const acknowledgeAlert = useRealtimeStore((s) => s.acknowledgeAlert);

  const recentAlerts = alerts.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {recentAlerts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No alerts
          </p>
        ) : (
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between gap-3 rounded-md border p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={severityStyles[alert.severity]}
                    >
                      {alert.severity}
                    </Badge>
                    <span className="truncate text-sm font-medium">
                      {alert.deviceName}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {alert.message}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {format(new Date(alert.timestamp), "dd MMM HH:mm:ss")}
                  </p>
                </div>
                {!alert.acknowledged && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => acknowledgeAlert(alert.id)}
                    title="Acknowledge"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
