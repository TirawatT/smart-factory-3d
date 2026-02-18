"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeviceStore } from "@/stores/device-store";
import { useRealtimeStore } from "@/stores/realtime-store";
import { Box, Maximize2, Minimize2, Settings } from "lucide-react";
import { useState } from "react";

interface MatterportViewerProps {
  className?: string;
}

export function MatterportViewer({ className }: MatterportViewerProps) {
  const defaultUrl = "/src_3d/IndustrialWorkshopFoundry2/index.htm";
  const [url, setUrl] = useState(defaultUrl);
  const [editUrl, setEditUrl] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const setSelectedDeviceId = useRealtimeStore((s) => s.setSelectedDeviceId);
  const getDeviceByTagId = useDeviceStore((s) => s.getDeviceByTagId);

  if (typeof window !== "undefined") {
    window.addEventListener("message", (event) => {
      try {
        const data = event.data;
        if (data && data.tagId) {
          const device = getDeviceByTagId(data.tagId);
          if (device) {
            setSelectedDeviceId(device.id);
          }
        }
      } catch {
        // ignore non-JSON messages
      }
    });
  }

  const handleSaveUrl = () => {
    setUrl(editUrl);
    setShowConfig(false);
  };

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-lg ${className ?? ""} ${fullscreen ? "fixed inset-0 z-50" : ""}`}
      style={{
        background: "#0b1520",
        border: "1px solid #192e48",
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{
          background: "linear-gradient(90deg, #0b1520, #0f1d2e)",
          borderBottom: "1px solid #192e48",
        }}
      >
        <div
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "#e0ecf7" }}
        >
          <Box
            className="h-4 w-4"
            style={{
              color: "#00c8ff",
              filter: "drop-shadow(0 0 4px rgba(0,200,255,0.5))",
            }}
          />
          <span>Digital Twin</span>
          <span style={{ color: "#4a6d8a" }}>—</span>
          <span style={{ color: "#7fa3c2" }}>3D View</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#142338]"
            onClick={() => setShowConfig(!showConfig)}
          >
            <Settings className="h-4 w-4" style={{ color: "#7fa3c2" }} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#142338]"
            onClick={() => setFullscreen(!fullscreen)}
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" style={{ color: "#7fa3c2" }} />
            ) : (
              <Maximize2 className="h-4 w-4" style={{ color: "#7fa3c2" }} />
            )}
          </Button>
        </div>
      </div>

      {/* URL Config */}
      {showConfig && (
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ background: "#0f1d2e", borderBottom: "1px solid #192e48" }}
        >
          <Input
            placeholder="Matterport URL (e.g. https://my.matterport.com/show/?m=...)"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            className="h-8 text-xs border-[#192e48] bg-[#0b1520] text-[#e0ecf7] placeholder:text-[#4a6d8a]"
          />
          <Button
            size="sm"
            className="h-8 bg-[#00c8ff] text-[#070d18] hover:bg-[#00b0e0] font-semibold"
            onClick={handleSaveUrl}
          >
            Load
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="relative flex-1">
        {url ? (
          <iframe
            src={url}
            className="h-full w-full border-0"
            allow="fullscreen; xr-spatial-tracking"
            allowFullScreen
            title="Digital Twin 3D View"
          />
        ) : (
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center sf-grid-bg">
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(0,200,255,0.05)",
                border: "1px solid rgba(0,200,255,0.1)",
              }}
            >
              <Box
                className="h-16 w-16"
                style={{
                  color: "#00c8ff",
                  opacity: 0.4,
                  filter: "drop-shadow(0 0 10px rgba(0,200,255,0.3))",
                }}
              />
            </div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: "#e0ecf7" }}
              >
                3D Digital Twin
              </h3>
              <p className="mt-1 text-sm" style={{ color: "#7fa3c2" }}>
                Click the{" "}
                <Settings
                  className="inline h-3.5 w-3.5"
                  style={{ color: "#00c8ff" }}
                />{" "}
                icon to configure Matterport URL or paste any 3D model iframe
                source.
              </p>
              <p className="mt-2 text-xs" style={{ color: "#4a6d8a" }}>
                Clicking on tags/pins in the 3D model will display device
                information in the side panel.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[#192e48] bg-[#0b1520] text-[#00c8ff] hover:bg-[#142338] hover:border-[#00c8ff]/30"
              onClick={() => setShowConfig(true)}
            >
              Configure 3D Source
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
