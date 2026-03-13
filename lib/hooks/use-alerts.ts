import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alertsApi, AlertsQuery } from "@/lib/api/alerts";

export const alertKeys = {
  all: ["alerts"] as const,
  list: (q?: AlertsQuery) => [...alertKeys.all, "list", q] as const,
};

export function useAlerts(query?: AlertsQuery) {
  return useQuery({
    queryKey: alertKeys.list(query),
    queryFn: () => alertsApi.list(query),
    staleTime: 15_000,
    refetchInterval: 15_000,
  });
}

export function useAcknowledgeAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsApi.acknowledge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: alertKeys.all }),
  });
}

export function useAcknowledgeAllAlerts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => alertsApi.acknowledgeAll(),
    onSuccess: () => qc.invalidateQueries({ queryKey: alertKeys.all }),
  });
}
