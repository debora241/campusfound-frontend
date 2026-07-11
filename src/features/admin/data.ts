export interface ManagedSchool {
  id: string;
  name: string;
  type: "School" | "University";
  region: string;
  users: number;
  status: "active" | "suspended";
}

export const MANAGED_SCHOOLS: ManagedSchool[] = [
  { id: "MS-1", name: "Lycée Bilingue de Douala", type: "School", region: "Littoral", users: 1120, status: "active" },
  { id: "MS-2", name: "Université de Douala", type: "University", region: "Littoral", users: 1610, status: "active" },
  { id: "MS-3", name: "Collège Saint Michel", type: "School", region: "Littoral", users: 745, status: "active" },
  { id: "MS-4", name: "Government Bilingual High School", type: "School", region: "South West", users: 980, status: "suspended" },
];

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "disabled";
}

export const SYSTEM_USERS: SystemUser[] = [
  { id: "USR-1", name: "Mrs. Linda Achu", email: "l.achu@lyceebdouala.cm", role: "Teacher", status: "active" },
  { id: "USR-2", name: "Fatou Diallo", email: "f.diallo@gmail.com", role: "Parent", status: "active" },
  { id: "USR-3", name: "Dr. Alain Kwedi", email: "a.kwedi@univ-douala.cm", role: "Faculty", status: "active" },
  { id: "USR-4", name: "Samuel Etoundi", email: "s.etoundi@minedub.cm", role: "Government", status: "invited" },
  { id: "USR-5", name: "Marc Talla", email: "m.talla@gmail.com", role: "Student", status: "disabled" },
];

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
}

export const AUDIT_LOGS: AuditLogEntry[] = [
  { id: "LOG-1", actor: "admin@campusfound.africa", action: "Suspended school", target: "Government Bilingual High School", time: "Jul 5, 2026 · 2:14 PM" },
  { id: "LOG-2", actor: "s.etoundi@minedub.cm", action: "Exported national statistics", target: "Statistics module", time: "Jul 5, 2026 · 11:02 AM" },
  { id: "LOG-3", actor: "admin@campusfound.africa", action: "Issued API key", target: "Integration: SMS Gateway", time: "Jul 4, 2026 · 4:40 PM" },
  { id: "LOG-4", actor: "l.achu@lyceebdouala.cm", action: "Updated grade record", target: "Student STU-1042", time: "Jul 4, 2026 · 9:15 AM" },
];

export interface ApiKey {
  id: string;
  label: string;
  createdOn: string;
  lastUsed: string;
  scopes: string[];
}

export const API_KEYS: ApiKey[] = [
  { id: "KEY-1", label: "SMS Gateway Integration", createdOn: "Jun 1, 2026", lastUsed: "2 hours ago", scopes: ["sms:send"] },
  { id: "KEY-2", label: "Government Reporting Feed", createdOn: "May 12, 2026", lastUsed: "Yesterday", scopes: ["stats:read"] },
];

export interface BackupEntry {
  id: string;
  label: string;
  createdOn: string;
  sizeGb: number;
  status: "completed" | "in-progress";
}

export const BACKUPS: BackupEntry[] = [
  { id: "BK-1", label: "Nightly automated backup", createdOn: "Jul 6, 2026 · 2:00 AM", sizeGb: 42.1, status: "completed" },
  { id: "BK-2", label: "Nightly automated backup", createdOn: "Jul 5, 2026 · 2:00 AM", sizeGb: 41.8, status: "completed" },
  { id: "BK-3", label: "Pre-migration snapshot", createdOn: "Jul 3, 2026 · 6:30 PM", sizeGb: 40.9, status: "completed" },
];

export const SYSTEM_LOAD = [
  { time: "00:00", requests: 1200 },
  { time: "04:00", requests: 800 },
  { time: "08:00", requests: 4200 },
  { time: "12:00", requests: 5600 },
  { time: "16:00", requests: 5100 },
  { time: "20:00", requests: 2400 },
];
