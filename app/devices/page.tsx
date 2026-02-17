"use client";

import { DeviceFormDialog } from "@/components/devices/device-form-dialog";
import { DeviceTable } from "@/components/devices/device-table";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ZONES } from "@/lib/mock-data";
import { Device } from "@/lib/types";
import { useDeviceStore } from "@/stores/device-store";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function DevicesPage() {
  const devices = useDeviceStore((s) => s.devices);
  const [search, setSearch] = useState("");
  const [filterZone, setFilterZone] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      const matchSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.type.toLowerCase().includes(search.toLowerCase()) ||
        d.location.toLowerCase().includes(search.toLowerCase());
      const matchZone = filterZone === "all" || d.zone === filterZone;
      const matchStatus = filterStatus === "all" || d.status === filterStatus;
      return matchSearch && matchZone && matchStatus;
    });
  }, [devices, search, filterZone, filterStatus]);

  const handleEdit = (device: Device) => {
    setEditDevice(device);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditDevice(null);
    setDialogOpen(true);
  };

  return (
    <>
      <Header
        title="Devices"
        subtitle={`${devices.length} devices registered`}
      />
      <div className="space-y-4 p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterZone} onValueChange={setFilterZone}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {ZONES.map((z) => (
                <SelectItem key={z} value={z}>
                  {z}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredDevices.length} of {devices.length} devices
        </p>

        {/* Table */}
        <DeviceTable devices={filteredDevices} onEdit={handleEdit} />

        {/* Form Dialog */}
        <DeviceFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editDevice={editDevice}
        />
      </div>
    </>
  );
}
