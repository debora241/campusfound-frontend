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
