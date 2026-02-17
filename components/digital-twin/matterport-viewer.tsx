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
  const [url, setUrl] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const setSelectedDeviceId = useRealtimeStore((s) => s.setSelectedDeviceId);
  const getDeviceByTagId = useDeviceStore((s) => s.getDeviceByTagId);

  // Listen for postMessage from Matterport iframe
  if (typeof window !== "undefined") {
    window.addEventListener("message", (event) => {
      try {
        const data = event.data;
        // Matterport sends tag click events
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
      className={`relative flex flex-col overflow-hidden rounded-lg border bg-muted/30 ${className ?? ""} ${fullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-card px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Box className="h-4 w-4 text-primary" />
          Digital Twin — 3D View
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowConfig(!showConfig)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setFullscreen(!fullscreen)}
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* URL Config */}
      {showConfig && (
        <div className="flex items-center gap-2 border-b bg-card px-3 py-2">
          <Input
            placeholder="Matterport URL (e.g. https://my.matterport.com/show/?m=...)"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            className="h-8 text-xs"
          />
          <Button size="sm" className="h-8" onClick={handleSaveUrl}>
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
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="rounded-2xl bg-muted p-6">
              <Box className="h-16 w-16 text-muted-foreground/50" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">3D Digital Twin</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Click the <Settings className="inline h-3.5 w-3.5" /> icon to
                configure Matterport URL or paste any 3D model iframe source.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Clicking on tags/pins in the 3D model will display device
                information in the side panel.
              </p>
            </div>
            {/* Demo: Quick select device */}
            <Button
              variant="outline"
              size="sm"
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
