import type { Role } from "./navigation";

/** The 12 authentication roles from the Cameroon auth spec. Several of
 * these (nursery/primary/secondary/university_student) share the single
 * built-out Student dashboard for now — see AUTH_ROLE_TO_DASHBOARD_ROLE. */
export type AuthRole =
  | "nursery"
  | "primary"
  | "secondary"
  | "university_student"
  | "parent"
  | "teacher"
  | "school_admin"
  | "university_admin"
  | "police"
  | "government"
  | "health_partner"
  | "alumni";

export const AUTH_ROLE_TO_DASHBOARD_ROLE: Record<AuthRole, Role> = {
  nursery: "student",
  primary: "student",
  secondary: "student",
  university_student: "student",
  parent: "parent",
  teacher: "teacher",
  school_admin: "school_admin",
  university_admin: "university_admin",
  police: "police",
  government: "government",
  health_partner: "health_partner",
  alumni: "alumni",
};

export interface AuthRoleMeta {
  label: string;
  emoji: string;
  description: string;
}

export const AUTH_ROLE_META: Record<AuthRole, AuthRoleMeta> = {
  nursery: { label: "Nursery Pupil", emoji: "👶", description: "Ages 3–5 · parent-confirmed access" },
  primary: { label: "Primary Pupil", emoji: "📚", description: "Primary school" },
  secondary: { label: "Secondary Student", emoji: "🏫", description: "Forms 1–5, Lower & Upper Sixth" },
  university_student: { label: "University Student", emoji: "🎓", description: "Undergraduate & postgraduate" },
  parent: { label: "Parent / Guardian", emoji: "👨‍👩‍👧", description: "" },
  teacher: { label: "Teacher / Lecturer", emoji: "👩‍🏫", description: "" },
  school_admin: { label: "School Administration", emoji: "🏫", description: "" },
  university_admin: { label: "University Administration", emoji: "🎓", description: "" },
  police: { label: "Police", emoji: "👮", description: "Emergency & child protection" },
  government: { label: "Government", emoji: "🏛", description: "MINEDUB · MINESEC · MINESUP" },
  health_partner: { label: "Health Partner", emoji: "❤️", description: "" },
  alumni: { label: "Alumni", emoji: "🎓", description: "" },
};
