// ============================================================
// Smart Factory — Theme Store (Zustand + persist)
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  paletteId: string;
  styleId: string;
  setPalette: (id: string) => void;
  setStyle: (id: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      paletteId: "cyber-cyan",
      styleId: "cyber",

      setPalette: (id: string) => set({ paletteId: id }),
      setStyle: (id: string) => set({ styleId: id }),
    }),
    {
      name: "sf-theme",
    }
  )
);
