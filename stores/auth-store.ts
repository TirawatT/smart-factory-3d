// ============================================================
// Smart Factory — Auth Store (Zustand)
// Mock implementation — replace login() with real API later
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "admin" | "manager" | "operator" | "guest";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  sites: Array<{ id: string; name: string }>;
  modules: string[];
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasModule: (module: string) => boolean;
}

// ── Mock users ────────────────────────────────────────────
const MOCK_USERS: Array<AuthUser & { password: string }> = [
  {
    id: "user-001",
    email: "admin@factory.com",
    password: "Admin@123",
    fullName: "Admin User",
    role: "admin",
    sites: [{ id: "site-001", name: "NMC Chonburi" }],
    modules: [
      "core",
      "iot_control",
      "energy",
      "analytics",
      "simulation",
      "ai_rca",
      "emergency",
      "audit_trail",
      "device_management",
    ],
  },
  {
    id: "user-002",
    email: "manager@factory.com",
    password: "Manager@123",
    fullName: "Factory Manager",
    role: "manager",
    sites: [{ id: "site-001", name: "NMC Chonburi" }],
    modules: ["core", "iot_control", "energy", "analytics"],
  },
  {
    id: "user-003",
    email: "operator@factory.com",
    password: "Operator@123",
    fullName: "Floor Operator",
    role: "operator",
    sites: [{ id: "site-001", name: "NMC Chonburi" }],
    modules: ["core", "iot_control"],
  },
];

// Permission matrix per role
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ["*"], // all permissions
  manager: [
    "dashboard.view",
    "digitaltwin.view",
    "iot.control.view",
    "iot.control.start",
    "iot.control.adjust",
    "alert.view",
    "alert.acknowledge",
    "alert.resolve",
    "energy.view",
    "analytics.view",
    "analytics.export",
    "device.manage",
    "user.view",
  ],
  operator: [
    "dashboard.view",
    "digitaltwin.view",
    "iot.control.view",
    "iot.control.start",
    "alert.view",
    "alert.acknowledge",
  ],
  guest: ["dashboard.view", "digitaltwin.view", "alert.view"],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        const found = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (!found) {
          throw new Error("Invalid email or password");
        }

        const { password: _, ...user } = found;

        // Mock JWT token
        const accessToken = btoa(
          JSON.stringify({ user_id: user.id, role: user.role, exp: Date.now() + 15 * 60 * 1000 })
        );

        set({ user, accessToken, isAuthenticated: true });
        // Set cookie for middleware (edge runtime cannot read localStorage)
        document.cookie = "sf-authenticated=true; path=/; max-age=604800; SameSite=Strict";
      },

      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
        document.cookie = "sf-authenticated=; path=/; max-age=0";
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user) return false;

        const perms = ROLE_PERMISSIONS[user.role];
        if (perms.includes("*")) return true;
        return perms.includes(permission);
      },

      hasModule: (module: string) => {
        const { user } = get();
        if (!user) return false;
        return user.modules.includes(module);
      },
    }),
    {
      name: "sf-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
