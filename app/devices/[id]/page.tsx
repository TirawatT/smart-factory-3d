"use client";

import { GaugeChart } from "@/components/charts/gauge-chart";
import { RealtimeLineChart } from "@/components/charts/realtime-line-chart";
import { DeviceFormDialog } from "@/components/devices/device-form-dialog";
import { Header } from "@/components/layout/header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertSeverity, DeviceStatus } from "@/lib/types";
import { useDeviceStore } from "@/stores/device-store";
import { useRealtimeStore } from "@/stores/realtime-store";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

const statusVariant: Record<DeviceStatus, string> = {
  online: "bg-green-500/10 text-green-500 border-green-500/20",
  offline: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
};

const severityStyles: Record<AlertSeverity, string> = {
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export default function DeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const devices = useDeviceStore((s) => s.devices);
  const deleteDevice = useDeviceStore((s) => s.deleteDevice);
  const getReadings = useRealtimeStore((s) => s.getReadings);
  const alerts = useRealtimeStore((s) => s.alerts);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const device = devices.find((d) => d.id === id);

  if (!device) {
    return (
      <>
        <Header title="Device Not Found" />
        <div className="flex flex-col items-center justify-center gap-4 p-12">
          <p className="text-muted-foreground">
            Device with ID &quot;{id}&quot; was not found.
          </p>
          <Button asChild variant="outline">
            <Link href="/devices">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Devices
            </Link>
          </Button>
        </div>
      </>
    );
  }

  const deviceAlerts = alerts.filter((a) => a.deviceId === device.id);

  const handleDelete = () => {
    deleteDevice(device.id);
    router.push("/devices");
  };

  return (
    <>
      <Header title={device.name} subtitle={device.description} />
      <div className="space-y-6 p-6">
        {/* Back + Actions */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href="/devices">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Devices
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>

        {/* Device Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-start gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={statusVariant[device.status]}
                  >
                    {device.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {device.type}
                  </Badge>
                  <Badge variant="outline">{device.zone}</Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {device.location}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Last updated:{" "}
                  {format(new Date(device.updatedAt), "dd MMM yyyy HH:mm")}
                </div>
                {device.matterportTagId && (
                  <p className="text-xs text-muted-foreground">
                    Matterport Tag: {device.matterportTagId}
                  </p>
                )}
              </div>
              {/* Quick Gauges */}
              <div className="flex flex-wrap gap-4">
                {device.sensors.slice(0, 3).map((sensor) => (
                  <GaugeChart
                    key={sensor.id}
                    value={sensor.currentValue}
                    min={sensor.min}
                    max={sensor.max}
                    thresholdWarning={sensor.thresholdWarning}
                    thresholdCritical={sensor.thresholdCritical}
                    unit={sensor.unit}
                    label={sensor.name}
                    size={110}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Detail Cards + Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {device.sensors.map((sensor) => {
            const readings = getReadings(sensor.id);
            const isWarning = sensor.currentValue >= sensor.thresholdWarning;
            const isCritical = sensor.currentValue >= sensor.thresholdCritical;

            return (
              <Card key={sensor.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {sensor.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {isCritical && (
                        <Badge
                          variant="outline"
                          className="bg-red-500/10 text-red-500 border-red-500/20"
                        >
                          Critical
                        </Badge>
                      )}
                      {isWarning && !isCritical && (
                        <Badge
                          variant="outline"
                          className="bg-amber-500/10 text-amber-500 border-amber-500/20"
                        >
                          Warning
                        </Badge>
                      )}
                      <span className="text-lg font-bold">
                        {sensor.currentValue.toFixed(1)}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          {sensor.unit}
                        </span>
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Range: {sensor.min} – {sensor.max} {sensor.unit} | Warn:{" "}
                    {sensor.thresholdWarning} | Critical:{" "}
                    {sensor.thresholdCritical}
                  </p>
                </CardHeader>
                <CardContent>
                  <RealtimeLineChart
                    readings={readings}
                    unit={sensor.unit}
                    height={200}
                    thresholdWarning={sensor.thresholdWarning}
                    thresholdCritical={sensor.thresholdCritical}
                    color={
                      isCritical ? "#ef4444" : isWarning ? "#f59e0b" : undefined
                    }
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alert History */}
        {deviceAlerts.length > 0 && (
          <>
            <Separator />
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Alert History
              </h2>
              <div className="space-y-2">
                {deviceAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={severityStyles[alert.severity]}
                      >
                        {alert.severity}
                      </Badge>
                      <div>
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(alert.timestamp),
                            "dd MMM yyyy HH:mm:ss",
                          )}
                        </p>
                      </div>
                    </div>
                    {alert.acknowledged && (
                      <Badge variant="outline" className="text-xs">
                        Acknowledged
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Dialog */}
      <DeviceFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        editDevice={device}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Device</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{device.name}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
