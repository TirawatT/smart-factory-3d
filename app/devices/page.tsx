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
      <div className="space-y-4 p-6 sf-fade-in">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: "#4a6d8a" }}
            />
            <Input
              placeholder="Search devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-[#192e48] bg-[#0b1520] text-[#e0ecf7] placeholder:text-[#4a6d8a] focus:border-[#00c8ff]/50"
            />
          </div>
          <Select value={filterZone} onValueChange={setFilterZone}>
            <SelectTrigger className="w-[200px] border-[#192e48] bg-[#0b1520] text-[#e0ecf7]">
              <SelectValue placeholder="Filter by zone" />
            </SelectTrigger>
            <SelectContent className="border-[#192e48] bg-[#0f1d2e]">
              <SelectItem
                value="all"
                className="text-[#e0ecf7] focus:bg-[#142338] focus:text-[#00c8ff]"
              >
                All Zones
              </SelectItem>
              {ZONES.map((z) => (
                <SelectItem
                  key={z}
                  value={z}
                  className="text-[#e0ecf7] focus:bg-[#142338] focus:text-[#00c8ff]"
                >
                  {z}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px] border-[#192e48] bg-[#0b1520] text-[#e0ecf7]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="border-[#192e48] bg-[#0f1d2e]">
              <SelectItem
                value="all"
                className="text-[#e0ecf7] focus:bg-[#142338] focus:text-[#00c8ff]"
              >
                All Status
              </SelectItem>
              <SelectItem
                value="online"
                className="text-[#e0ecf7] focus:bg-[#142338] focus:text-[#00c8ff]"
              >
                Online
              </SelectItem>
              <SelectItem
                value="offline"
                className="text-[#e0ecf7] focus:bg-[#142338] focus:text-[#00c8ff]"
              >
                Offline
              </SelectItem>
              <SelectItem
                value="warning"
                className="text-[#e0ecf7] focus:bg-[#142338] focus:text-[#00c8ff]"
              >
                Warning
              </SelectItem>
              <SelectItem
                value="critical"
                className="text-[#e0ecf7] focus:bg-[#142338] focus:text-[#00c8ff]"
              >
                Critical
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleAdd}
            className="bg-[#00c8ff] text-[#070d18] hover:bg-[#00b0e0] font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>

        {/* Results count */}
        <p className="text-sm" style={{ color: "#4a6d8a" }}>
          Showing{" "}
          <span className="sf-mono" style={{ color: "#00c8ff" }}>
            {filteredDevices.length}
          </span>{" "}
          of{" "}
          <span className="sf-mono" style={{ color: "#00c8ff" }}>
            {devices.length}
          </span>{" "}
          devices
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
