"use client";

import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "./app-shell";

const PUBLIC_ROUTES = ["/login"];

interface LayoutProviderProps {
  children: React.ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!isPublic && !isAuthenticated) {
      router.replace("/login");
    }
    if (isPublic && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isPublic, pathname, router]);

  // Auth page — no sidebar
  if (isPublic) {
    return <>{children}</>;
  }

  // Not authenticated yet — render nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated — full app shell
  return <AppShell>{children}</AppShell>;
}
