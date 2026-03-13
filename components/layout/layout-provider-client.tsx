"use client";

import dynamic from "next/dynamic";

// ssr: false must live in a Client Component (not a Server Component)
const LayoutProvider = dynamic(
  () => import("./layout-provider").then((m) => m.LayoutProvider),
  { ssr: false }
);

export function LayoutProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutProvider>{children}</LayoutProvider>;
}
