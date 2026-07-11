export interface SosAlert {
  id: string;
  student: string;
  school: string;
  location: string;
  triggeredAt: string;
  status: "active" | "responding" | "resolved";
}

export const SOS_ALERTS: SosAlert[] = [
  { id: "SOS-1", student: "Junior Diallo", school: "Lycée Bilingue de Douala", location: "Bonaberi route, 2.1km from school", triggeredAt: "2 min ago", status: "active" },
  { id: "SOS-2", student: "Grace Achieng", school: "Collège Saint Michel", location: "Deido junction", triggeredAt: "18 min ago", status: "responding" },
  { id: "SOS-3", student: "Kwame Boateng", school: "Lycée Bilingue de Douala", location: "Akwa market area", triggeredAt: "Yesterday, 4:12 PM", status: "resolved" },
];

export interface MissingStudent {
  id: string;
  name: string;
  school: string;
  lastSeen: string;
  lastLocation: string;
  status: "searching" | "found";
}

export const MISSING_STUDENTS: MissingStudent[] = [
  { id: "MS-1", name: "Emmanuel Fru", school: "Government Bilingual High School", lastSeen: "Jul 5, 3:30 PM", lastLocation: "School exit gate B", status: "searching" },
  { id: "MS-2", name: "Ruth Nkemelu", school: "Lycée Bilingue de Douala", lastSeen: "Jul 2, 5:00 PM", lastLocation: "Bus stop, Bonaberi", status: "found" },
];

export interface GeoFence {
  id: string;
  name: string;
  radius: string;
  studentsInZone: number;
  status: "normal" | "breach";
}

export const GEOFENCES: GeoFence[] = [
  { id: "GF-1", name: "Lycée Bilingue de Douala — campus perimeter", radius: "500m", studentsInZone: 1042, status: "normal" },
  { id: "GF-2", name: "Collège Saint Michel — campus perimeter", radius: "400m", studentsInZone: 680, status: "normal" },
  { id: "GF-3", name: "Government Bilingual High School — campus perimeter", radius: "450m", studentsInZone: 910, status: "breach" },
];

export interface Incident {
  id: string;
  title: string;
  location: string;
  severity: "low" | "medium" | "high";
  reportedAt: string;
  status: "open" | "investigating" | "closed";
}

export const INCIDENTS: Incident[] = [
  { id: "INC-1", title: "Altercation near school gate", location: "Government Bilingual High School", severity: "medium", reportedAt: "Jul 5, 1:10 PM", status: "investigating" },
  { id: "INC-2", title: "Suspicious vehicle reported near campus", location: "Lycée Bilingue de Douala", severity: "high", reportedAt: "Jul 4, 7:45 AM", status: "open" },
  { id: "INC-3", title: "Theft reported in school parking area", location: "Collège Saint Michel", severity: "low", reportedAt: "Jun 30, 2:30 PM", status: "closed" },
];

export interface ResponseRecord {
  id: string;
  incident: string;
  respondingUnit: string;
  responseTime: string;
  outcome: string;
}

export const RESPONSE_HISTORY: ResponseRecord[] = [
  { id: "RH-1", incident: "SOS — Kwame Boateng", respondingUnit: "Unit 4 — Akwa", responseTime: "6 min", outcome: "Student safely escorted home" },
  { id: "RH-2", incident: "Missing student — Ruth Nkemelu", respondingUnit: "Unit 2 — Bonaberi", responseTime: "42 min", outcome: "Found at relative's home, reunited with parents" },
  { id: "RH-3", incident: "Theft reported — Collège Saint Michel", respondingUnit: "Unit 7 — Deido", responseTime: "14 min", outcome: "Case closed, item recovered" },
];
