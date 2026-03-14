"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ZONES } from "@/lib/mock-data";
import { Device, DeviceStatus, DeviceType } from "@/lib/types";
import { useCreateDevice, useUpdateDevice } from "@/lib/hooks/use-devices";
import { useEffect, useState } from "react";

interface DeviceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editDevice: Device | null;
}

export function DeviceFormDialog({
  open,
  onOpenChange,
  editDevice,
}: DeviceFormDialogProps) {
  const { mutate: createDevice } = useCreateDevice();
  const { mutate: updateDevice } = useUpdateDevice();

  const [name, setName] = useState("");
  const [type, setType] = useState<DeviceType>("temperature");
  const [location, setLocation] = useState("");
  const [zone, setZone] = useState("");
  const [status, setStatus] = useState<DeviceStatus>("online");

  useEffect(() => {
    if (editDevice) {
      setName(editDevice.name);
      setType(editDevice.type);
      setLocation(editDevice.location);
      setZone(editDevice.zone);
      setStatus(editDevice.status);
    } else {
      setName("");
      setType("temperature");
      setLocation("");
      setZone("");
      setStatus("online");
    }
  }, [editDevice, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type || !location || !zone) return;

    if (editDevice) {
      updateDevice({ id: editDevice.id, data: { name, type, location, zone } });
    } else {
      createDevice({ name, type, description: "", location, zone, matterportTagId: "", sensors: [] });
    }
    onOpenChange(false);
  };

  const inputClasses =
    "border-[#192e48] bg-[#0b1520] text-[#e0ecf7] placeholder:text-[#4a6d8a] focus:border-[#00c8ff]/50";
  const labelClasses = "text-xs font-medium uppercase tracking-wider";
  const selectItemClasses =
    "text-[#e0ecf7] focus:bg-[#142338] focus:text-[#00c8ff]";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[#192e48] bg-[#0f1d2e] sm:max-w-md">
        <DialogHeader>
          <DialogTitle style={{ color: "#e0ecf7" }}>
            {editDevice ? "Edit Device" : "Add Device"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className={labelClasses}
              style={{ color: "#7fa3c2" }}
            >
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Device name"
              required
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="type"
              className={labelClasses}
              style={{ color: "#7fa3c2" }}
            >
              Type
            </Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as DeviceType)}
            >
              <SelectTrigger className={inputClasses}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-[#192e48] bg-[#0f1d2e]">
                {(
                  [
                    "temperature",
                    "humidity",
                    "pressure",
                    "vibration",
                    "power",
                    "flow",
                    "level",
                    "gas",
                  ] as DeviceType[]
                ).map((t) => (
                  <SelectItem key={t} value={t} className={selectItemClasses}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="location"
              className={labelClasses}
              style={{ color: "#7fa3c2" }}
            >
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Building A, Floor 2"
              required
              className={inputClasses}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={labelClasses} style={{ color: "#7fa3c2" }}>
                Zone
              </Label>
              <Select value={zone} onValueChange={setZone}>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent className="border-[#192e48] bg-[#0f1d2e]">
                  {ZONES.map((z) => (
                    <SelectItem key={z} value={z} className={selectItemClasses}>
                      {z}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={labelClasses} style={{ color: "#7fa3c2" }}>
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as DeviceStatus)}
              >
                <SelectTrigger className={inputClasses}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[#192e48] bg-[#0f1d2e]">
                  <SelectItem value="online" className={selectItemClasses}>
                    Online
                  </SelectItem>
                  <SelectItem value="offline" className={selectItemClasses}>
                    Offline
                  </SelectItem>
                  <SelectItem value="warning" className={selectItemClasses}>
                    Warning
                  </SelectItem>
                  <SelectItem value="critical" className={selectItemClasses}>
                    Critical
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#192e48] bg-[#0b1520] text-[#7fa3c2] hover:bg-[#142338] hover:text-[#e0ecf7]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#00c8ff] text-[#070d18] hover:bg-[#00b0e0] font-semibold"
            >
              {editDevice ? "Save Changes" : "Add Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
