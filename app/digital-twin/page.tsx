"use client";

import { DeviceInfoPanel } from "@/components/digital-twin/device-info-panel";
import { MatterportViewer } from "@/components/digital-twin/matterport-viewer";
import { Header } from "@/components/layout/header";

export default function DigitalTwinPage() {
  return (
    <>
      <Header
        title="Digital Twin"
        subtitle="3D Model & IoT Device Visualization"
      />
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* 3D Viewer - takes most of the space */}
        <div className="flex-1 p-4">
          <MatterportViewer className="h-full" />
        </div>

        {/* Device Info Panel - right side */}
        <div className="w-80 shrink-0 xl:w-96">
          <DeviceInfoPanel />
        </div>
      </div>
    </>
  );
}
