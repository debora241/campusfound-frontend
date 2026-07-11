export interface Student {
  id: string;
  name: string;
  className: string;
  guardian: string;
  status: "active" | "suspended" | "graduated";
  feesStatus: "paid" | "partial" | "overdue";
  avatarColor: string;
}

export const STUDENTS: Student[] = [
  { id: "STU-1042", name: "Aminata Diallo", className: "Form 5A", guardian: "Fatou Diallo", status: "active", feesStatus: "paid", avatarColor: "bg-gold-light" },
  { id: "STU-1043", name: "Junior Mbeki", className: "Form 3B", guardian: "Paul Mbeki", status: "active", feesStatus: "overdue", avatarColor: "bg-verified-light" },
  { id: "STU-1044", name: "Grace Achieng", className: "Form 5A", guardian: "Rose Achieng", status: "active", feesStatus: "partial", avatarColor: "bg-ink-50" },
  { id: "STU-1045", name: "Kwame Boateng", className: "Form 1C", guardian: "Kofi Boateng", status: "suspended", feesStatus: "paid", avatarColor: "bg-gold-light" },
  { id: "STU-1046", name: "Chidinma Okafor", className: "Form 4A", guardian: "Ngozi Okafor", status: "active", feesStatus: "paid", avatarColor: "bg-verified-light" },
  { id: "STU-1047", name: "Thabo Nkosi", className: "Form 2B", guardian: "Sipho Nkosi", status: "graduated", feesStatus: "paid", avatarColor: "bg-ink-50" },
  { id: "STU-1048", name: "Fatima Bello", className: "Form 5A", guardian: "Aisha Bello", status: "active", feesStatus: "overdue", avatarColor: "bg-gold-light" },
  { id: "STU-1049", name: "Emeka Nwosu", className: "Form 3B", guardian: "Chuka Nwosu", status: "active", feesStatus: "paid", avatarColor: "bg-verified-light" },
  { id: "STU-1050", name: "Aicha Traoré", className: "Form 1C", guardian: "Moussa Traoré", status: "active", feesStatus: "partial", avatarColor: "bg-ink-50" },
  { id: "STU-1051", name: "David Osei", className: "Form 4A", guardian: "Samuel Osei", status: "active", feesStatus: "paid", avatarColor: "bg-gold-light" },
];

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  classes: number;
  status: "active" | "on-leave";
}

export const TEACHERS: Teacher[] = [
  { id: "TCH-201", name: "Mr. Jean Fotso", subject: "Mathematics", classes: 4, status: "active" },
  { id: "TCH-202", name: "Mrs. Linda Achu", subject: "English", classes: 5, status: "active" },
  { id: "TCH-203", name: "Mr. Samuel Eto", subject: "Physics", classes: 3, status: "on-leave" },
  { id: "TCH-204", name: "Ms. Brenda Njoya", subject: "Biology", classes: 4, status: "active" },
  { id: "TCH-205", name: "Mr. Paul Ngu", subject: "History", classes: 6, status: "active" },
];

export interface Admission {
  id: string;
  applicant: string;
  gradeApplied: string;
  stage: "submitted" | "review" | "interview" | "accepted" | "rejected";
  submittedOn: string;
}

export const ADMISSIONS: Admission[] = [
  { id: "ADM-501", applicant: "Marc Talla", gradeApplied: "Form 1", stage: "review", submittedOn: "Jul 1, 2026" },
  { id: "ADM-502", applicant: "Sarah Kome", gradeApplied: "Form 2", stage: "interview", submittedOn: "Jun 28, 2026" },
  { id: "ADM-503", applicant: "Ibrahim Sy", gradeApplied: "Form 1", stage: "submitted", submittedOn: "Jul 3, 2026" },
  { id: "ADM-504", applicant: "Nadia Fouda", gradeApplied: "Form 3", stage: "accepted", submittedOn: "Jun 20, 2026" },
  { id: "ADM-505", applicant: "Peter Ayuk", gradeApplied: "Form 1", stage: "rejected", submittedOn: "Jun 18, 2026" },
];

export interface SchoolClass {
  id: string;
  name: string;
  teacher: string;
  students: number;
  room: string;
}

export const CLASSES: SchoolClass[] = [
  { id: "CLS-1", name: "Form 5A", teacher: "Mrs. Linda Achu", students: 32, room: "Block A · Rm 12" },
  { id: "CLS-2", name: "Form 4A", teacher: "Mr. Jean Fotso", students: 29, room: "Block A · Rm 14" },
  { id: "CLS-3", name: "Form 3B", teacher: "Ms. Brenda Njoya", students: 34, room: "Block B · Rm 3" },
  { id: "CLS-4", name: "Form 2B", teacher: "Mr. Paul Ngu", students: 31, room: "Block B · Rm 5" },
  { id: "CLS-5", name: "Form 1C", teacher: "Mr. Samuel Eto", students: 28, room: "Block C · Rm 1" },
];

export interface FeeRecord {
  id: string;
  student: string;
  className: string;
  amountDue: number;
  amountPaid: number;
  status: "paid" | "partial" | "overdue";
  dueDate: string;
}

export const FEES: FeeRecord[] = [
  { id: "FEE-1", student: "Aminata Diallo", className: "Form 5A", amountDue: 150000, amountPaid: 150000, status: "paid", dueDate: "Jun 30, 2026" },
  { id: "FEE-2", student: "Junior Mbeki", className: "Form 3B", amountDue: 130000, amountPaid: 0, status: "overdue", dueDate: "Jun 15, 2026" },
  { id: "FEE-3", student: "Grace Achieng", className: "Form 5A", amountDue: 150000, amountPaid: 80000, status: "partial", dueDate: "Jul 15, 2026" },
  { id: "FEE-4", student: "Fatima Bello", className: "Form 5A", amountDue: 150000, amountPaid: 0, status: "overdue", dueDate: "Jun 10, 2026" },
  { id: "FEE-5", student: "Aicha Traoré", className: "Form 1C", amountDue: 110000, amountPaid: 60000, status: "partial", dueDate: "Jul 20, 2026" },
];

export interface Exam {
  id: string;
  name: string;
  className: string;
  date: string;
  status: "scheduled" | "in-progress" | "graded";
}

export const EXAMS: Exam[] = [
  { id: "EXM-1", name: "Mid-Term Mathematics", className: "Form 5A", date: "Jul 8, 2026", status: "scheduled" },
  { id: "EXM-2", name: "Mid-Term English", className: "Form 4A", date: "Jul 9, 2026", status: "scheduled" },
  { id: "EXM-3", name: "Term 2 Physics", className: "Form 3B", date: "Jun 25, 2026", status: "graded" },
  { id: "EXM-4", name: "Term 2 Biology", className: "Form 2B", date: "Jun 27, 2026", status: "in-progress" },
];

export interface Credential {
  id: string;
  student: string;
  type: "Report Card" | "Certificate" | "Diploma";
  issuedOn: string;
  verified: boolean;
  txHash: string;
}

export const CREDENTIALS: Credential[] = [
  { id: "CRD-1", student: "Thabo Nkosi", type: "Diploma", issuedOn: "Jun 20, 2026", verified: true, txHash: "0x8a2f…c19e" },
  { id: "CRD-2", student: "Aminata Diallo", type: "Report Card", issuedOn: "Jun 30, 2026", verified: true, txHash: "0x3d91…7bA2" },
  { id: "CRD-3", student: "Grace Achieng", type: "Certificate", issuedOn: "Jun 15, 2026", verified: true, txHash: "0xef04…22c1" },
  { id: "CRD-4", student: "Chidinma Okafor", type: "Report Card", issuedOn: "Jul 1, 2026", verified: false, txHash: "pending" },
];

export interface DisciplineCase {
  id: string;
  student: string;
  incident: string;
  severity: "minor" | "moderate" | "severe";
  status: "open" | "resolved";
  reportedOn: string;
}

export const DISCIPLINE_CASES: DisciplineCase[] = [
  { id: "DSC-1", student: "Kwame Boateng", incident: "Repeated absence without notice", severity: "moderate", status: "open", reportedOn: "Jul 2, 2026" },
  { id: "DSC-2", student: "Junior Mbeki", incident: "Uniform policy violation", severity: "minor", status: "resolved", reportedOn: "Jun 25, 2026" },
];

export interface Announcement {
  id: string;
  title: string;
  audience: string;
  publishedOn: string;
  pinned: boolean;
}

export const ANNOUNCEMENTS: Announcement[] = [
  { id: "ANN-1", title: "Mid-term exam timetable published", audience: "All students & parents", publishedOn: "Jul 4, 2026", pinned: true },
  { id: "ANN-2", title: "Parent-Teacher conference — July 18", audience: "All parents", publishedOn: "Jul 3, 2026", pinned: true },
  { id: "ANN-3", title: "Library extended hours during exams", audience: "All students", publishedOn: "Jun 30, 2026", pinned: false },
];

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  copies: number;
  available: number;
}

export const LIBRARY_BOOKS: LibraryBook[] = [
  { id: "LIB-1", title: "Principles of Physics", author: "R. Serway", copies: 12, available: 3 },
  { id: "LIB-2", title: "African History since 1800", author: "J. Fage", copies: 8, available: 8 },
  { id: "LIB-3", title: "Introduction to Algebra", author: "M. Artin", copies: 15, available: 0 },
];

export interface TransportRoute {
  id: string;
  route: string;
  driver: string;
  students: number;
  status: "on-time" | "delayed";
}

export const TRANSPORT_ROUTES: TransportRoute[] = [
  { id: "RT-1", route: "Bonaberi — Campus", driver: "Etienne Mballa", students: 38, status: "on-time" },
  { id: "RT-2", route: "Deido — Campus", driver: "Marcel Wamba", students: 29, status: "delayed" },
];
