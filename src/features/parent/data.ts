export interface Child {
  id: string;
  name: string;
  className: string;
  school: string;
  avatarColor: string;
  attendanceRate: number;
  gpa: number;
  gpaTrend: { term: string; gpa: number; predicted?: boolean }[];
  feesDue: number;
  feesPaid: number;
}

export const CHILDREN: Child[] = [
  {
    id: "CH-1",
    name: "Aminata Diallo",
    className: "Form 5A",
    school: "Lycée Bilingue de Douala",
    avatarColor: "bg-gold-light",
    attendanceRate: 96,
    gpa: 3.6,
    gpaTrend: [
      { term: "T1", gpa: 3.2 },
      { term: "T2", gpa: 3.4 },
      { term: "T3", gpa: 3.6 },
      { term: "T4", gpa: 3.7, predicted: true },
    ],
    feesDue: 150000,
    feesPaid: 150000,
  },
  {
    id: "CH-2",
    name: "Junior Diallo",
    className: "Form 2B",
    school: "Lycée Bilingue de Douala",
    avatarColor: "bg-verified-light",
    attendanceRate: 88,
    gpa: 2.9,
    gpaTrend: [
      { term: "T1", gpa: 3.0 },
      { term: "T2", gpa: 2.95 },
      { term: "T3", gpa: 2.9 },
      { term: "T4", gpa: 2.7, predicted: true },
    ],
    feesDue: 130000,
    feesPaid: 60000,
  },
];

export interface AttendanceRecord {
  date: string;
  child: string;
  status: "present" | "absent" | "late";
}

export const ATTENDANCE: AttendanceRecord[] = [
  { date: "Jul 4, 2026", child: "Aminata Diallo", status: "present" },
  { date: "Jul 4, 2026", child: "Junior Diallo", status: "late" },
  { date: "Jul 3, 2026", child: "Aminata Diallo", status: "present" },
  { date: "Jul 3, 2026", child: "Junior Diallo", status: "absent" },
  { date: "Jul 2, 2026", child: "Aminata Diallo", status: "present" },
  { date: "Jul 2, 2026", child: "Junior Diallo", status: "present" },
  { date: "Jul 1, 2026", child: "Aminata Diallo", status: "present" },
  { date: "Jul 1, 2026", child: "Junior Diallo", status: "present" },
];

export interface PaymentRecord {
  id: string;
  description: string;
  child: string;
  amount: number;
  date: string;
  method: string;
}

export const PAYMENT_HISTORY: PaymentRecord[] = [
  { id: "PMT-1", description: "Term 4 school fees", child: "Aminata Diallo", amount: 150000, date: "Jun 28, 2026", method: "Mobile Money" },
  { id: "PMT-2", description: "Term 4 fees — installment 1", child: "Junior Diallo", amount: 60000, date: "Jun 15, 2026", method: "Bank transfer" },
  { id: "PMT-3", description: "Library fine", child: "Aminata Diallo", amount: 2000, date: "May 30, 2026", method: "Wallet" },
];

export interface Message {
  id: string;
  from: string;
  role: string;
  preview: string;
  time: string;
  unread: boolean;
}

export const MESSAGES: Message[] = [
  { id: "MSG-1", from: "Mrs. Linda Achu", role: "Class Teacher — Form 5A", preview: "Aminata did excellent work on the physics project this week.", time: "10:12 AM", unread: true },
  { id: "MSG-2", from: "School Administration", role: "Lycée Bilingue de Douala", preview: "Reminder: Parent-Teacher conference on July 18.", time: "Yesterday", unread: true },
  { id: "MSG-3", from: "Mr. Paul Ngu", role: "Class Teacher — Form 2B", preview: "Junior has missed two assignments this week. Let's discuss.", time: "Jul 2", unread: false },
];

export interface EmergencyAlert {
  id: string;
  child: string;
  type: string;
  time: string;
  severity: "info" | "warning" | "critical";
  resolved: boolean;
}

export const EMERGENCY_ALERTS: EmergencyAlert[] = [
  { id: "ALT-1", child: "Junior Diallo", type: "Late arrival at school", time: "Jul 4, 7:52 AM", severity: "info", resolved: true },
  { id: "ALT-2", child: "Aminata Diallo", type: "Early pickup requested by staff", time: "Jun 30, 2:10 PM", severity: "warning", resolved: true },
];
