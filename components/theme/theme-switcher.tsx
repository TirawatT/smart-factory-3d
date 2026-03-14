"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useThemeStore } from "@/stores/theme-store";
import { COLOR_PALETTES, STYLE_THEMES, getPalette, getStyle } from "@/lib/themes";

const PALETTE_GROUPS = ["Cyber", "Matrix", "Neon", "Inferno", "Cosmic", "Mono"];

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const paletteId = useThemeStore((s) => s.paletteId);
  const styleId = useThemeStore((s) => s.styleId);
  const setPalette = useThemeStore((s) => s.setPalette);
  const setStyle = useThemeStore((s) => s.setStyle);

  const currentPalette = getPalette(paletteId);
  const currentStyle = getStyle(styleId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 hover:bg-[#142338]"
          style={{ color: "#7fa3c2" }}
          title="Theme Switcher"
        >
          <Palette className="h-4 w-4" />
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-w-lg border-[#192e48] p-0 overflow-hidden"
        style={{ background: "#0b1520", color: "#e0ecf7" }}
      >
        <DialogHeader className="px-5 pt-5 pb-3" style={{ borderBottom: "1px solid #192e48" }}>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold" style={{ color: "#e0ecf7" }}>
            <Palette className="h-4 w-4" style={{ color: "var(--sf-primary, #00c8ff)" }} />
            Theme Switcher
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh] px-5 py-4 space-y-5">
          {/* Style Section */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "#4a6d8a" }}>
              Style
            </p>
            <div className="grid grid-cols-3 gap-2">
              {STYLE_THEMES.map((style) => {
                const isSelected = styleId === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setStyle(style.id)}
                    className="rounded-md p-3 text-left transition-all duration-200 hover:opacity-90"
                    style={{
                      background: "#0f1d2e",
                      border: isSelected
                        ? `1.5px solid var(--sf-primary, #00c8ff)`
                        : "1.5px solid #192e48",
                      boxShadow: isSelected
                        ? `0 0 12px var(--sf-primary-glow, rgba(0,200,255,0.3))`
                        : "none",
                    }}
                  >
                    <p className="text-xs font-semibold mb-0.5" style={{ color: isSelected ? "var(--sf-primary, #00c8ff)" : "#e0ecf7" }}>
                      {style.name}
                    </p>
                    <p className="text-[10px]" style={{ color: "#4a6d8a" }}>
                      {style.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Palette Section */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "#4a6d8a" }}>
              Color Palette
            </p>
            <div className="space-y-3">
              {PALETTE_GROUPS.map((group) => {
                const palettes = COLOR_PALETTES.filter((p) => p.group === group);
                return (
                  <div key={group}>
                    <p className="text-[9px] uppercase tracking-widest mb-1.5" style={{ color: "#2d4a63" }}>
                      {group}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {palettes.map((palette) => {
                        const isSelected = paletteId === palette.id;
                        return (
                          <button
                            key={palette.id}
                            onClick={() => setPalette(palette.id)}
                            title={palette.name}
                            className="relative flex-shrink-0 transition-transform duration-150 hover:scale-110"
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: palette.primary,
                              boxShadow: isSelected
                                ? `0 0 0 2px #0b1520, 0 0 0 4px white, 0 0 8px ${palette.glow}`
                                : `0 0 6px ${palette.glow}`,
                              outline: "none",
                            }}
                            aria-label={palette.name}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Preview Bar */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid #192e48", background: "#070d18" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-4 w-4 rounded-full flex-shrink-0"
              style={{
                background: currentPalette.primary,
                boxShadow: `0 0 8px ${currentPalette.glow}`,
              }}
            />
            <span className="text-xs font-mono" style={{ color: "#7fa3c2" }}>
              {currentPalette.primary.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest" style={{ color: "#4a6d8a" }}>
              {currentStyle.name}
            </span>
            <span className="text-[10px]" style={{ color: "#2d4a63" }}>
              · {currentPalette.name}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
