"use client";

import { DeviceInfoPanel } from "@/components/digital-twin/device-info-panel";
import { MatterportViewer } from "@/components/digital-twin/matterport-viewer";
import { Header } from "@/components/layout/header";
import { useRealtimeStore } from "@/stores/realtime-store";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function DigitalTwinInner() {
  const searchParams = useSearchParams();
  const setSelectedDeviceId = useRealtimeStore((s) => s.setSelectedDeviceId);

  useEffect(() => {
    const deviceId = searchParams.get("device");
    if (deviceId) {
      setSelectedDeviceId(deviceId);
    }
  }, [searchParams, setSelectedDeviceId]);

  return (
    <>
      <Header
        title="Digital Twin"
        subtitle="3D Model & IoT Device Visualization"
      />
      <div className="flex flex-col-reverse md:flex-row h-auto md:h-[calc(100vh-3.5rem)] sf-fade-in">
        <div className="flex-1 p-2 sm:p-4 min-h-[300px] md:min-h-0">
          <MatterportViewer className="h-full min-h-[280px] md:min-h-0" />
        </div>
        <div className="w-full md:w-80 shrink-0 xl:md:w-96">
          <DeviceInfoPanel />
        </div>
      </div>
    </>
  );
}

export default function DigitalTwinPage() {
  return (
    <Suspense fallback={null}>
      <DigitalTwinInner />
    </Suspense>
  );
}
