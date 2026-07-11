import { apiClient } from "./apiClient";

export interface BackendManagedInstitution {
  id: string;
  name: string;
  type: "School" | "University";
  region: string;
  users: number;
  active: boolean;
}

export interface BackendSystemUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  dashboardRole: string;
  isActive: boolean;
}

export interface BackendAuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
}

export interface BackendSystemStats {
  totalUsers: number;
  totalInstitutions: number;
  verifiedCredentials: number;
  processUptimeSeconds: number;
  nodeVersion: string;
}

export interface BackendApiKey {
  id: string;
  label: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt: string | null;
  plainKey?: string;
}

export interface BackendBackup {
  id: string;
  label: string;
  sizeGb: number;
  status: "completed" | "in_progress";
  createdAt: string;
}

export const adminApi = {
  institutions: {
    list: (token: string) => apiClient.get<BackendManagedInstitution[]>("/admin/institutions", token),
    toggle: (token: string, type: "school" | "university", id: string) =>
      apiClient.patch<BackendManagedInstitution>(`/admin/institutions/${type}/${id}/toggle`, {}, token),
  },
  users: {
    list: (token: string) => apiClient.get<BackendSystemUser[]>("/admin/users", token),
    toggle: (token: string, id: string) => apiClient.patch<BackendSystemUser>(`/admin/users/${id}/toggle`, {}, token),
  },
  auditLogs: {
    list: (token: string) => apiClient.get<BackendAuditLogEntry[]>("/admin/audit-logs", token),
  },
  system: {
    stats: (token: string) => apiClient.get<BackendSystemStats>("/admin/system", token),
  },
  apiKeys: {
    list: (token: string) => apiClient.get<BackendApiKey[]>("/admin/api-keys", token),
    create: (token: string, label: string) => apiClient.post<BackendApiKey>("/admin/api-keys", { label }, token),
    revoke: (token: string, id: string) => apiClient.delete(`/admin/api-keys/${id}`, token),
  },
  backups: {
    list: (token: string) => apiClient.get<BackendBackup[]>("/admin/backups", token),
    trigger: (token: string) => apiClient.post<BackendBackup>("/admin/backups", {}, token),
  },
  settings: {
    get: (token: string) => apiClient.get<Record<string, boolean>>("/admin/settings", token),
    update: (token: string, key: string, value: boolean) => apiClient.patch(`/admin/settings`, { key, value }, token),
  },
};
