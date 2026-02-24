"use client";

import { Header } from "@/components/layout/header";
import { SecurityViewer } from "@/components/security/security-viewer";

export default function SecurityPage() {
  return (
    <>
      <Header
        title="Security"
        subtitle="3D Scenario Visualization & Emergency Response"
      />
      <div className="h-auto md:h-[calc(100vh-3.5rem)] p-2 sm:p-4 sf-fade-in">
        <div
          className="h-full min-h-[400px] overflow-hidden rounded-lg"
          style={{ border: "1px solid #192e48" }}
        >
          <SecurityViewer />
        </div>
      </div>
    </>
  );
}
