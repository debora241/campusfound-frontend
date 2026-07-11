export interface UniStudent {
  id: string;
  name: string;
  program: string;
  year: number;
  status: "enrolled" | "on-leave" | "graduated";
  gpaAvg: number;
}

export const UNI_STUDENTS: UniStudent[] = [
  { id: "UNI-3001", name: "Bertrand Ateba", program: "Computer Science", year: 3, status: "enrolled", gpaAvg: 3.4 },
  { id: "UNI-3002", name: "Solange Mbida", program: "Civil Engineering", year: 2, status: "enrolled", gpaAvg: 3.1 },
  { id: "UNI-3003", name: "Yannick Fokou", program: "Medicine", year: 5, status: "enrolled", gpaAvg: 3.7 },
  { id: "UNI-3004", name: "Chantal Ndip", program: "Law", year: 4, status: "on-leave", gpaAvg: 2.9 },
  { id: "UNI-3005", name: "Herve Talom", program: "Computer Science", year: 4, status: "enrolled", gpaAvg: 3.5 },
  { id: "UNI-3006", name: "Larissa Enow", program: "Economics", year: 1, status: "enrolled", gpaAvg: 3.0 },
  { id: "UNI-3007", name: "Patrice Owona", program: "Civil Engineering", year: 5, status: "graduated", gpaAvg: 3.3 },
];

export interface Faculty {
  id: string;
  name: string;
  department: string;
  role: "Professor" | "Senior Lecturer" | "Lecturer";
  students: number;
}

export const FACULTY: Faculty[] = [
  { id: "FAC-101", name: "Prof. Marie Ateba", department: "Computer Science", role: "Professor", students: 120 },
  { id: "FAC-102", name: "Dr. Alain Kwedi", department: "Civil Engineering", role: "Senior Lecturer", students: 88 },
  { id: "FAC-103", name: "Prof. Isabelle Fon", department: "Medicine", role: "Professor", students: 64 },
  { id: "FAC-104", name: "Dr. Robert Etoundi", department: "Law", role: "Lecturer", students: 95 },
];

export interface Program {
  id: string;
  name: string;
  faculty: string;
  durationYears: number;
  enrolled: number;
}

export const PROGRAMS: Program[] = [
  { id: "PRG-1", name: "B.Sc. Computer Science", faculty: "Faculty of Science", durationYears: 4, enrolled: 412 },
  { id: "PRG-2", name: "B.Eng. Civil Engineering", faculty: "Faculty of Engineering", durationYears: 5, enrolled: 298 },
  { id: "PRG-3", name: "Doctor of Medicine", faculty: "Faculty of Medicine", durationYears: 7, enrolled: 210 },
  { id: "PRG-4", name: "LL.B. Law", faculty: "Faculty of Law", durationYears: 4, enrolled: 356 },
  { id: "PRG-5", name: "B.Sc. Economics", faculty: "Faculty of Social Science", durationYears: 3, enrolled: 189 },
];

export interface UniExam {
  id: string;
  name: string;
  program: string;
  date: string;
  status: "scheduled" | "in-progress" | "graded";
}

export const UNI_EXAMS: UniExam[] = [
  { id: "UEX-1", name: "Data Structures Final", program: "B.Sc. Computer Science", date: "Jul 12, 2026", status: "scheduled" },
  { id: "UEX-2", name: "Structural Analysis II", program: "B.Eng. Civil Engineering", date: "Jul 10, 2026", status: "scheduled" },
  { id: "UEX-3", name: "Anatomy Practical", program: "Doctor of Medicine", date: "Jun 29, 2026", status: "graded" },
];

export interface Diploma {
  id: string;
  student: string;
  program: string;
  classification: string;
  issuedOn: string;
  verified: boolean;
  txHash: string;
}

export const DIPLOMAS: Diploma[] = [
  { id: "DIP-1", student: "Patrice Owona", program: "B.Eng. Civil Engineering", classification: "Upper Second Class", issuedOn: "Jun 22, 2026", verified: true, txHash: "0x9c1a…44fe" },
  { id: "DIP-2", student: "Nadia Fongang", program: "LL.B. Law", classification: "First Class", issuedOn: "Jun 20, 2026", verified: true, txHash: "0x2f8b…091d" },
  { id: "DIP-3", student: "Simon Beti", program: "B.Sc. Economics", classification: "Second Class", issuedOn: "Jul 1, 2026", verified: false, txHash: "pending" },
];

export interface UniFeeRecord {
  id: string;
  student: string;
  program: string;
  amountDue: number;
  amountPaid: number;
  status: "paid" | "partial" | "overdue";
}

export const UNI_FEES: UniFeeRecord[] = [
  { id: "UF-1", student: "Bertrand Ateba", program: "Computer Science", amountDue: 450000, amountPaid: 450000, status: "paid" },
  { id: "UF-2", student: "Solange Mbida", program: "Civil Engineering", amountDue: 480000, amountPaid: 240000, status: "partial" },
  { id: "UF-3", student: "Chantal Ndip", program: "Law", amountDue: 420000, amountPaid: 0, status: "overdue" },
];
