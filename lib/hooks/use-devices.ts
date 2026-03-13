import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { devicesApi, DevicesQuery, ControlCommand } from "@/lib/api/devices";
import { DeviceFormData } from "@/lib/types";

export const deviceKeys = {
  all: ["devices"] as const,
  list: (q?: DevicesQuery) => [...deviceKeys.all, "list", q] as const,
  detail: (id: string) => [...deviceKeys.all, "detail", id] as const,
  telemetry: (id: string) => [...deviceKeys.all, "telemetry", id] as const,
};

export function useDevices(query?: DevicesQuery) {
  return useQuery({
    queryKey: deviceKeys.list(query),
    queryFn: () => devicesApi.list(query),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useDevice(id: string) {
  return useQuery({
    queryKey: deviceKeys.detail(id),
    queryFn: () => devicesApi.get(id),
    enabled: !!id,
    staleTime: 15_000,
  });
}

export function useDeviceTelemetry(id: string, limit = 24) {
  return useQuery({
    queryKey: deviceKeys.telemetry(id),
    queryFn: () => devicesApi.telemetry(id, { limit }),
    enabled: !!id,
    refetchInterval: 10_000,
  });
}

export function useCreateDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DeviceFormData) => devicesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: deviceKeys.all }),
  });
}

export function useUpdateDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeviceFormData> }) => devicesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: deviceKeys.all }),
  });
}

export function useDeleteDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => devicesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: deviceKeys.all }),
  });
}

export function useControlDevice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cmd: ControlCommand) => devicesApi.control(cmd),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: deviceKeys.detail(vars.deviceId) });
    },
  });
}
