"use client";

import { useThemeStore } from "@/stores/theme-store";
import { getPalette, getStyle } from "@/lib/themes";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const paletteId = useThemeStore((s) => s.paletteId);
  const styleId = useThemeStore((s) => s.styleId);

  useEffect(() => {
    const palette = getPalette(paletteId);
    const style = getStyle(styleId);
    const root = document.documentElement;

    root.style.setProperty("--sf-primary", palette.primary);
    root.style.setProperty("--sf-primary-rgb", palette.primaryRgb);
    root.style.setProperty("--sf-primary-glow", palette.glow);
    root.style.setProperty("--sf-radius", style.radius);
    root.style.setProperty("--sf-font-mono", style.fontMono);

    root.setAttribute("data-style", styleId);
  }, [paletteId, styleId]);

  return <>{children}</>;
}
