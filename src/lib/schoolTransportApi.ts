import { apiClient } from "./apiClient";

export interface BackendBusRoute {
  id: string;
  name: string;
  driverName: string | null;
  status: "on_time" | "delayed";
  studentCount: number;
}

export const schoolTransportApi = {
  list: (token: string) => apiClient.get<BackendBusRoute[]>("/school/transport", token),
  create: (token: string, payload: { name: string; driverName?: string }) =>
    apiClient.post<BackendBusRoute>("/school/transport", payload, token),
};
