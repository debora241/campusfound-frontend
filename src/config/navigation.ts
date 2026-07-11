import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, GraduationCap, Users, UserCheck, Building2, ShieldAlert,
  Landmark, HeartPulse, Award, ShieldCheck, BookOpen, ClipboardList,
  CalendarDays, Wallet, MessageSquare, FileBadge2, Library, Bus,
  Bell, Settings, Sparkles, Stethoscope, Siren, MapPinned, BarChart3,
  FileCheck2, Building, Radio, Boxes, Trophy, Briefcase, Cog,
} from "lucide-react";

export type Role =
  | "student" | "parent" | "teacher" | "school_admin" | "university_admin"
  | "police" | "government" | "health_partner" | "alumni" | "super_admin";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  children?: NavItem[];
}

export const ROLE_LABELS: Record<Role, string> = {
  student: "Student",
  parent: "Parent",
  teacher: "Teacher",
  school_admin: "School Administration",
  university_admin: "University Administration",
  police: "Police",
  government: "Government",
  health_partner: "Health Partner",
  alumni: "Alumni",
  super_admin: "Super Administrator",
};

export const ROLE_DASHBOARD_PATH: Record<Role, string> = {
  student: "/student",
  parent: "/parent",
  teacher: "/teacher",
  school_admin: "/school",
  university_admin: "/university",
  police: "/police",
  government: "/government",
  health_partner: "/health",
  alumni: "/alumni",
  super_admin: "/admin",
};

export const NAVIGATION: Record<Role, NavItem[]> = {
  student: [
    { label: "Dashboard", path: "/student", icon: LayoutDashboard },
    { label: "Courses", path: "/student/courses", icon: BookOpen },
    { label: "Assignments", path: "/student/assignments", icon: ClipboardList },
    { label: "Grades", path: "/student/grades", icon: BarChart3 },
    { label: "AI Career Guidance", path: "/student/career-guidance", icon: Sparkles },
    { label: "Digital Library", path: "/student/library", icon: Library },
    { label: "Skill Passport", path: "/student/skill-passport", icon: FileBadge2 },
    { label: "Portfolio", path: "/student/portfolio", icon: Briefcase },
    { label: "Community", path: "/student/community", icon: Users },
    { label: "Wallet", path: "/student/wallet", icon: Wallet },
    { label: "Messages", path: "/student/messages", icon: MessageSquare },
    { label: "Calendar", path: "/student/calendar", icon: CalendarDays },
  ],
  parent: [
    { label: "Dashboard", path: "/parent", icon: LayoutDashboard },
    { label: "Children Overview", path: "/parent/children", icon: Users },
    { label: "Attendance", path: "/parent/attendance", icon: ClipboardList },
    { label: "Grades & AI Prediction", path: "/parent/grades", icon: Sparkles },
    { label: "Payments & Fees", path: "/parent/payments", icon: Wallet },
    { label: "Transport Tracking", path: "/parent/transport", icon: Bus },
    { label: "Health", path: "/parent/health", icon: HeartPulse },
    { label: "Messages", path: "/parent/messages", icon: MessageSquare },
    { label: "Emergency Alerts", path: "/parent/alerts", icon: Siren },
  ],
  teacher: [
    { label: "Dashboard", path: "/teacher", icon: LayoutDashboard },
    { label: "Classes", path: "/teacher/classes", icon: Users },
    { label: "Attendance", path: "/teacher/attendance", icon: ClipboardList },
    { label: "Assignments", path: "/teacher/assignments", icon: BookOpen },
    { label: "Grading", path: "/teacher/grading", icon: BarChart3 },
    { label: "Timetable", path: "/teacher/timetable", icon: CalendarDays },
    { label: "Messages", path: "/teacher/messages", icon: MessageSquare },
  ],
  school_admin: [
    { label: "Dashboard", path: "/school", icon: LayoutDashboard },
    { label: "Students", path: "/school/students", icon: GraduationCap },
    { label: "Teachers", path: "/school/teachers", icon: UserCheck },
    { label: "Admissions", path: "/school/admissions", icon: ClipboardList },
    { label: "Classes & Courses", path: "/school/classes", icon: BookOpen },
    { label: "Fees & Accounting", path: "/school/finance", icon: Wallet },
    { label: "Examinations & Results", path: "/school/examinations", icon: FileBadge2 },
    { label: "Certificates & Diplomas", path: "/school/certificates", icon: Award },
    { label: "Library", path: "/school/library", icon: Library },
    { label: "Transport & Hostels", path: "/school/transport", icon: Bus },
    { label: "Discipline & Voting", path: "/school/discipline", icon: ShieldAlert },
    { label: "Announcements & Events", path: "/school/announcements", icon: Bell },
    { label: "Settings", path: "/school/settings", icon: Settings },
  ],
  university_admin: [
    { label: "Dashboard", path: "/university", icon: LayoutDashboard },
    { label: "Students", path: "/university/students", icon: GraduationCap },
    { label: "Faculty", path: "/university/faculty", icon: UserCheck },
    { label: "Programs & Courses", path: "/university/programs", icon: BookOpen },
    { label: "Examinations", path: "/university/examinations", icon: FileBadge2 },
    { label: "Diplomas (Blockchain)", path: "/university/diplomas", icon: ShieldCheck },
    { label: "Finance", path: "/university/finance", icon: Wallet },
    { label: "Settings", path: "/university/settings", icon: Settings },
  ],
  police: [
    { label: "Emergency Dashboard", path: "/police", icon: Siren },
    { label: "SOS Alerts", path: "/police/sos", icon: ShieldAlert },
    { label: "Missing Students", path: "/police/missing-students", icon: MapPinned },
    { label: "Geo-fencing", path: "/police/geofencing", icon: MapPinned },
    { label: "QR Scanner", path: "/police/qr-scanner", icon: FileCheck2 },
    { label: "Incident Reports", path: "/police/incidents", icon: ClipboardList },
    { label: "Response History", path: "/police/history", icon: BarChart3 },
  ],
  government: [
    { label: "National Dashboard", path: "/government", icon: Landmark },
    { label: "Schools", path: "/government/schools", icon: Building2 },
    { label: "Universities", path: "/government/universities", icon: Building },
    { label: "Statistics & Heatmaps", path: "/government/statistics", icon: BarChart3 },
    { label: "Dropout Analysis", path: "/government/dropout-analysis", icon: Sparkles },
    { label: "Funding & Compliance", path: "/government/funding", icon: Wallet },
    { label: "Public Diploma Verification", path: "/government/diploma-verification", icon: ShieldCheck },
  ],
  health_partner: [
    { label: "Dashboard", path: "/health", icon: LayoutDashboard },
    { label: "Medical Records", path: "/health/records", icon: HeartPulse },
    { label: "Vaccinations", path: "/health/vaccinations", icon: Stethoscope },
    { label: "Telemedicine", path: "/health/telemedicine", icon: Radio },
    { label: "SOS Button", path: "/health/sos", icon: Siren },
    { label: "Medical Reports", path: "/health/reports", icon: ClipboardList },
  ],
  alumni: [
    { label: "Dashboard", path: "/alumni", icon: LayoutDashboard },
    { label: "Network", path: "/alumni/network", icon: Users },
    { label: "Diploma Verification", path: "/alumni/diploma", icon: ShieldCheck },
    { label: "Mentorship", path: "/alumni/mentorship", icon: Trophy },
    { label: "Events", path: "/alumni/events", icon: CalendarDays },
  ],
  super_admin: [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Multi-school Management", path: "/admin/schools", icon: Boxes },
    { label: "Users & RBAC", path: "/admin/rbac", icon: ShieldCheck },
    { label: "Audit Logs", path: "/admin/audit-logs", icon: ClipboardList },
    { label: "System Monitoring", path: "/admin/monitoring", icon: BarChart3 },
    { label: "Integrations & API Keys", path: "/admin/integrations", icon: Cog },
    { label: "Backup & Restore", path: "/admin/backup", icon: FileCheck2 },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ],
};
