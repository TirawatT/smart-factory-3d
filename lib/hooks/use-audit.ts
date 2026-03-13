import { useQuery } from "@tanstack/react-query";
import { auditApi, AuditQuery } from "@/lib/api/audit";

export function useAuditLogs(query?: AuditQuery) {
  return useQuery({
    queryKey: ["audit", "list", query],
    queryFn: () => auditApi.list(query),
    staleTime: 30_000,
  });
}
