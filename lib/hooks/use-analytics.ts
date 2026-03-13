import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics";

export function useKPIs() {
  return useQuery({
    queryKey: ["analytics", "kpis"],
    queryFn: () => analyticsApi.kpis(),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useOEE(days = 42) {
  return useQuery({
    queryKey: ["analytics", "oee", days],
    queryFn: () => analyticsApi.oee({ days }),
    staleTime: 60_000,
  });
}

export function useProduction(days = 30) {
  return useQuery({
    queryKey: ["analytics", "production", days],
    queryFn: () => analyticsApi.production({ days }),
    staleTime: 60_000,
  });
}

export function useEnergy(days = 7) {
  return useQuery({
    queryKey: ["analytics", "energy", days],
    queryFn: () => analyticsApi.energy({ days }),
    staleTime: 60_000,
  });
}

export function useDowntimeCauses() {
  return useQuery({
    queryKey: ["analytics", "downtime"],
    queryFn: () => analyticsApi.downtimeCauses(),
    staleTime: 300_000,
  });
}

export function useTopConsumers() {
  return useQuery({
    queryKey: ["analytics", "top-consumers"],
    queryFn: () => analyticsApi.topConsumers(),
    staleTime: 300_000,
  });
}
