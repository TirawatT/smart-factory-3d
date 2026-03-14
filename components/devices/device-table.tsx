"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Device, DeviceStatus } from "@/lib/types";
import { useDeleteDevice } from "@/lib/hooks/use-devices";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const statusConfig: Record<DeviceStatus, { color: string; bg: string }> = {
  online: { color: "#00ff9d", bg: "rgba(0,255,157,0.1)" },
  offline: { color: "#4a6d8a", bg: "rgba(74,109,138,0.1)" },
  warning: { color: "#ffb800", bg: "rgba(255,184,0,0.1)" },
  critical: { color: "#ff4560", bg: "rgba(255,69,96,0.1)" },
};

interface DeviceTableProps {
  devices: Device[];
  onEdit: (device: Device) => void;
}

export function DeviceTable({ devices, onEdit }: DeviceTableProps) {
  const { mutate: deleteDevice } = useDeleteDevice();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteDevice(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: "#0b1520", border: "1px solid #192e48" }}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-[#192e48] hover:bg-transparent">
              <TableHead
                className="text-xs uppercase tracking-wider"
                style={{ color: "#4a6d8a" }}
              >
                Name
              </TableHead>
              <TableHead
                className="text-xs uppercase tracking-wider"
                style={{ color: "#4a6d8a" }}
              >
                Type
              </TableHead>
              <TableHead
                className="text-xs uppercase tracking-wider"
                style={{ color: "#4a6d8a" }}
              >
                Status
              </TableHead>
              <TableHead
                className="text-xs uppercase tracking-wider"
                style={{ color: "#4a6d8a" }}
              >
                Location
              </TableHead>
              <TableHead
                className="text-xs uppercase tracking-wider"
                style={{ color: "#4a6d8a" }}
              >
                Zone
              </TableHead>
              <TableHead
                className="text-xs uppercase tracking-wider"
                style={{ color: "#4a6d8a" }}
              >
                Sensors
              </TableHead>
              <TableHead
                className="text-right text-xs uppercase tracking-wider"
                style={{ color: "#4a6d8a" }}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => {
              const cfg = statusConfig[device.status];
              return (
                <TableRow
                  key={device.id}
                  className="border-[#192e48] hover:bg-[#142338] transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 rounded-full shrink-0"
                        style={{
                          background: cfg.color,
                          boxShadow: `0 0 4px ${cfg.color}60`,
                        }}
                      />
                      <span
                        className="font-medium"
                        style={{ color: "#e0ecf7" }}
                      >
                        {device.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-xs sf-mono"
                      style={{ color: "#7fa3c2" }}
                    >
                      {device.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-0 text-[10px] uppercase sf-mono"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {device.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs" style={{ color: "#7fa3c2" }}>
                      {device.location}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs" style={{ color: "#7fa3c2" }}>
                      {device.zone}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-xs sf-mono"
                      style={{ color: "#00c8ff" }}
                    >
                      {device.sensors.length}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-[#142338]"
                      >
                        <Link href={`/devices/${device.id}`}>
                          <Eye
                            className="h-4 w-4"
                            style={{ color: "#00c8ff" }}
                          />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-[#142338]"
                        onClick={() => onEdit(device)}
                      >
                        <Pencil
                          className="h-4 w-4"
                          style={{ color: "#7fa3c2" }}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-[rgba(255,69,96,0.1)]"
                        onClick={() => setDeleteId(device.id)}
                      >
                        <Trash2
                          className="h-4 w-4"
                          style={{ color: "#ff4560" }}
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="border-[#192e48] bg-[#0f1d2e]">
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: "#e0ecf7" }}>
              Delete Device
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: "#7fa3c2" }}>
              This action cannot be undone. This will permanently delete the
              device and all its sensor data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#192e48] bg-[#0b1520] text-[#7fa3c2] hover:bg-[#142338] hover:text-[#e0ecf7]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[#ff4560] text-white hover:bg-[#e0334f]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
