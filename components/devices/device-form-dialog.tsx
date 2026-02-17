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
import { Separator } from "@/components/ui/separator";
import { ZONES } from "@/lib/mock-data";
import { Device, DeviceFormData, DeviceType, SensorType } from "@/lib/types";
import { useDeviceStore } from "@/stores/device-store";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const deviceTypes: DeviceType[] = [
  "temperature",
  "humidity",
  "pressure",
  "vibration",
  "power",
  "flow",
  "level",
  "gas",
];

const sensorTypes: SensorType[] = [
  "temperature",
  "humidity",
  "pressure",
  "vibration",
  "power",
  "flow",
  "level",
  "gas",
  "rpm",
  "voltage",
  "current",
];

interface SensorFormRow {
  name: string;
  type: SensorType;
  unit: string;
  min: number;
  max: number;
  thresholdWarning: number;
  thresholdCritical: number;
}

const emptySensor: SensorFormRow = {
  name: "",
  type: "temperature",
  unit: "°C",
  min: 0,
  max: 100,
  thresholdWarning: 70,
  thresholdCritical: 90,
};

interface DeviceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editDevice?: Device | null;
}

export function DeviceFormDialog({
  open,
  onOpenChange,
  editDevice,
}: DeviceFormDialogProps) {
  const addDevice = useDeviceStore((s) => s.addDevice);
  const updateDevice = useDeviceStore((s) => s.updateDevice);

  const [name, setName] = useState(editDevice?.name ?? "");
  const [type, setType] = useState<DeviceType>(
    editDevice?.type ?? "temperature",
  );
  const [description, setDescription] = useState(editDevice?.description ?? "");
  const [location, setLocation] = useState(editDevice?.location ?? "");
  const [zone, setZone] = useState(editDevice?.zone ?? ZONES[0]);
  const [tagId, setTagId] = useState(editDevice?.matterportTagId ?? "");
  const [sensors, setSensors] = useState<SensorFormRow[]>(
    editDevice
      ? editDevice.sensors.map((s) => ({
          name: s.name,
          type: s.type,
          unit: s.unit,
          min: s.min,
          max: s.max,
          thresholdWarning: s.thresholdWarning,
          thresholdCritical: s.thresholdCritical,
        }))
      : [{ ...emptySensor }],
  );

  // Reset form when dialog opens with different device
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset on close
      setName("");
      setType("temperature");
      setDescription("");
      setLocation("");
      setZone(ZONES[0]);
      setTagId("");
      setSensors([{ ...emptySensor }]);
    }
    onOpenChange(isOpen);
  };

  const addSensorRow = () => setSensors([...sensors, { ...emptySensor }]);

  const removeSensorRow = (index: number) =>
    setSensors(sensors.filter((_, i) => i !== index));

  const updateSensorRow = (
    index: number,
    field: keyof SensorFormRow,
    value: string | number,
  ) => {
    const updated = [...sensors];
    (updated[index] as any)[field] = value;
    setSensors(updated);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    const data: DeviceFormData = {
      name: name.trim(),
      type,
      description: description.trim(),
      location: location.trim(),
      zone,
      matterportTagId: tagId.trim(),
      sensors: sensors
        .filter((s) => s.name.trim())
        .map((s) => ({
          name: s.name.trim(),
          type: s.type,
          unit: s.unit,
          min: Number(s.min),
          max: Number(s.max),
          thresholdWarning: Number(s.thresholdWarning),
          thresholdCritical: Number(s.thresholdCritical),
        })),
    };

    if (editDevice) {
      updateDevice(editDevice.id, data);
    } else {
      addDevice(data);
    }

    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editDevice ? "Edit Device" : "Add New Device"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Device Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Temperature Sensor A1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as DeviceType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Input
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Assembly Line 1, Column 3"
              />
            </div>
            <div className="space-y-2">
              <Label>Zone</Label>
              <Select value={zone} onValueChange={setZone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ZONES.map((z) => (
                    <SelectItem key={z} value={z}>
                      {z}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagId">Matterport Tag ID</Label>
            <Input
              id="tagId"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              placeholder="Tag ID for 3D model pin mapping"
            />
          </div>

          <Separator />

          {/* Sensors */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <Label className="text-sm font-semibold">Sensors</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSensorRow}
              >
                <Plus className="mr-1 h-3 w-3" /> Add Sensor
              </Button>
            </div>

            <div className="space-y-3">
              {sensors.map((sensor, i) => (
                <div
                  key={i}
                  className="rounded-md border bg-muted/30 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Sensor #{i + 1}
                    </span>
                    {sensors.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => removeSensorRow(i)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-[10px]">Name</Label>
                      <Input
                        value={sensor.name}
                        onChange={(e) =>
                          updateSensorRow(i, "name", e.target.value)
                        }
                        className="h-8 text-xs"
                        placeholder="Sensor name"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px]">Type</Label>
                      <Select
                        value={sensor.type}
                        onValueChange={(v) => updateSensorRow(i, "type", v)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sensorTypes.map((t) => (
                            <SelectItem
                              key={t}
                              value={t}
                              className="capitalize text-xs"
                            >
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[10px]">Unit</Label>
                      <Input
                        value={sensor.unit}
                        onChange={(e) =>
                          updateSensorRow(i, "unit", e.target.value)
                        }
                        className="h-8 text-xs"
                        placeholder="°C, %, bar..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <Label className="text-[10px]">Min</Label>
                      <Input
                        type="number"
                        value={sensor.min}
                        onChange={(e) =>
                          updateSensorRow(i, "min", Number(e.target.value))
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px]">Max</Label>
                      <Input
                        type="number"
                        value={sensor.max}
                        onChange={(e) =>
                          updateSensorRow(i, "max", Number(e.target.value))
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px]">Warn</Label>
                      <Input
                        type="number"
                        value={sensor.thresholdWarning}
                        onChange={(e) =>
                          updateSensorRow(
                            i,
                            "thresholdWarning",
                            Number(e.target.value),
                          )
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px]">Critical</Label>
                      <Input
                        type="number"
                        value={sensor.thresholdCritical}
                        onChange={(e) =>
                          updateSensorRow(
                            i,
                            "thresholdCritical",
                            Number(e.target.value),
                          )
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {editDevice ? "Save Changes" : "Add Device"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
