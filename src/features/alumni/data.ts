export interface AlumniProfile {
  id: string;
  name: string;
  graduationYear: number;
  program: string;
  currentRole: string;
  location: string;
}

export const ALUMNI_NETWORK: AlumniProfile[] = [
  { id: "AL-1", name: "Patrice Owona", graduationYear: 2026, program: "B.Eng. Civil Engineering", currentRole: "Structural Engineer, SOGEA-SATOM", location: "Douala" },
  { id: "AL-2", name: "Nadia Fongang", graduationYear: 2026, program: "LL.B. Law", currentRole: "Legal Associate, Foko Law Firm", location: "Yaoundé" },
  { id: "AL-3", name: "Thabo Nkosi", graduationYear: 2024, program: "Form 5A Diploma", currentRole: "Undergraduate, Université de Douala", location: "Douala" },
  { id: "AL-4", name: "Fatou Ngoy", graduationYear: 2022, program: "B.Sc. Computer Science", currentRole: "Software Engineer, MTN Cameroon", location: "Douala" },
];

export interface MentorshipConnection {
  id: string;
  student: string;
  topic: string;
  requestedOn: string;
  status: "requested" | "active" | "completed";
}

export const MENTORSHIPS: MentorshipConnection[] = [
  { id: "MEN-1", student: "Bertrand Ateba", topic: "Career path in software engineering", requestedOn: "Jul 3, 2026", status: "requested" },
  { id: "MEN-2", student: "Larissa Enow", topic: "Preparing for economics graduate school", requestedOn: "Jun 28, 2026", status: "active" },
  { id: "MEN-3", student: "Emeka Nwosu", topic: "Internship guidance", requestedOn: "Jun 10, 2026", status: "completed" },
];

export interface AlumniEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  attending: number;
}

export const ALUMNI_EVENTS: AlumniEvent[] = [
  { id: "EV-1", title: "Annual Alumni Homecoming", date: "Aug 15, 2026", location: "Douala Campus", attending: 214 },
  { id: "EV-2", title: "Tech Careers Panel", date: "Jul 22, 2026", location: "Online", attending: 87 },
];
