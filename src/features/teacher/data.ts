export interface TimetableEntry {
  day: string;
  time: string;
  className: string;
  room: string;
}

export const TIMETABLE: TimetableEntry[] = [
  { day: "Mon", time: "8:00 – 9:00", className: "Form 3B", room: "Rm 3" },
  { day: "Mon", time: "10:00 – 11:00", className: "Form 5A", room: "Rm 12" },
  { day: "Tue", time: "8:00 – 9:00", className: "Form 4A", room: "Rm 14" },
  { day: "Tue", time: "11:00 – 12:00", className: "Form 2B", room: "Rm 5" },
  { day: "Wed", time: "10:00 – 11:00", className: "Form 5A", room: "Rm 12" },
  { day: "Thu", time: "8:00 – 9:00", className: "Form 3B", room: "Rm 3" },
  { day: "Fri", time: "1:00 – 2:00", className: "Form 4A", room: "Rm 14" },
];

export interface TeacherMessage {
  id: string;
  from: string;
  role: string;
  preview: string;
  time: string;
  unread: boolean;
}

export const TEACHER_MESSAGES: TeacherMessage[] = [
  { id: "TM-1", from: "Fatou Diallo", role: "Parent — Aminata Diallo", preview: "Thank you for the feedback on the physics project.", time: "9:40 AM", unread: true },
  { id: "TM-2", from: "School Administration", role: "Lycée Bilingue de Douala", preview: "Please submit Term 4 grade sheets by July 20.", time: "Yesterday", unread: true },
  { id: "TM-3", from: "Paul Mbeki", role: "Parent — Junior Mbeki", preview: "Can we schedule a call about Junior's attendance?", time: "Jul 2", unread: false },
];
