export interface MedicalRecord {
  id: string;
  student: string;
  school: string;
  bloodGroup: string;
  allergies: string;
  lastUpdated: string;
}

export const MEDICAL_RECORDS: MedicalRecord[] = [
  { id: "MR-1", student: "Aminata Diallo", school: "Lycée Bilingue de Douala", bloodGroup: "O+", allergies: "Peanuts", lastUpdated: "Jun 20, 2026" },
  { id: "MR-2", student: "Junior Diallo", school: "Lycée Bilingue de Douala", bloodGroup: "A+", allergies: "None recorded", lastUpdated: "Jun 15, 2026" },
  { id: "MR-3", student: "Grace Achieng", school: "Collège Saint Michel", bloodGroup: "B+", allergies: "Penicillin", lastUpdated: "May 30, 2026" },
];

export interface VaccinationCampaign {
  id: string;
  name: string;
  school: string;
  coverage: number;
  dueDate: string;
}

export const VACCINATION_CAMPAIGNS: VaccinationCampaign[] = [
  { id: "VAC-1", name: "Measles booster", school: "Lycée Bilingue de Douala", coverage: 94, dueDate: "Completed Jun 2026" },
  { id: "VAC-2", name: "Tetanus booster", school: "Collège Saint Michel", coverage: 68, dueDate: "Jul 30, 2026" },
  { id: "VAC-3", name: "Hepatitis B (dose 2)", school: "Government Bilingual High School", coverage: 45, dueDate: "Aug 15, 2026" },
];

export interface TelemedicineRequest {
  id: string;
  student: string;
  reason: string;
  requestedAt: string;
  status: "pending" | "in-call" | "completed";
}

export const TELEMEDICINE_REQUESTS: TelemedicineRequest[] = [
  { id: "TM-1", student: "Junior Diallo", reason: "Persistent headache, missed 2 days", requestedAt: "10 min ago", status: "pending" },
  { id: "TM-2", student: "Kwame Boateng", reason: "Follow-up on asthma medication", requestedAt: "1 hour ago", status: "pending" },
  { id: "TM-3", student: "Aicha Traoré", reason: "Minor sports injury check", requestedAt: "Yesterday", status: "completed" },
];

export interface HealthSos {
  id: string;
  student: string;
  school: string;
  reason: string;
  time: string;
  status: "active" | "responding" | "resolved";
}

export const HEALTH_SOS: HealthSos[] = [
  { id: "HSOS-1", student: "Junior Diallo", school: "Lycée Bilingue de Douala", reason: "Reported difficulty breathing", time: "3 min ago", status: "active" },
  { id: "HSOS-2", student: "Fatima Bello", school: "Lycée Bilingue de Douala", reason: "Fainting episode in class", time: "40 min ago", status: "resolved" },
];

export interface MedicalReport {
  id: string;
  title: string;
  school: string;
  generatedOn: string;
}

export const MEDICAL_REPORTS: MedicalReport[] = [
  { id: "REP-1", title: "Term 4 vaccination coverage summary", school: "All partner schools", generatedOn: "Jul 1, 2026" },
  { id: "REP-2", title: "Health incident log — June 2026", school: "Lycée Bilingue de Douala", generatedOn: "Jun 30, 2026" },
];
