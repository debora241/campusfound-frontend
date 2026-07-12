import type { AuthRole } from "./authRoles";

export interface LoginField {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "tel" | "date";
}

export interface LoginOption {
  id: string;
  label: string;
  fields: LoginField[];
  /** After submitting this option, route through OTP verification. */
  usesOtp?: boolean;
  /** Show a checkbox offering OTP as an additional, optional step. */
  optionalOtp?: boolean;
}

export interface RoleAuthConfig {
  /** Multiple options render as tabs; a single option renders directly. */
  options: LoginOption[];
  /** Always route through OTP after submission, regardless of option (admin-tier 2FA). */
  mandatoryOtp?: boolean;
  /** Nursery and Government need bespoke UI beyond the generic tab form. */
  specialFlow?: "nursery" | "government";
}

export const AUTH_CONFIG: Record<AuthRole, RoleAuthConfig> = {
  nursery: {
    specialFlow: "nursery",
    options: [],
  },
  primary: {
    options: [
      {
        id: "admission",
        label: "Admission number",
        fields: [
          { name: "school", label: "School name" },
          { name: "admissionNumber", label: "Admission number" },
          { name: "className", label: "Class" },
          { name: "password", label: "Password or PIN", type: "password" },
        ],
      },
    ],
  },
  secondary: {
    options: [
      {
        id: "matricule",
        label: "Matricule",
        fields: [
          { name: "school", label: "School name" },
          { name: "matricule", label: "Student matricule" },
          { name: "password", label: "Password", type: "password" },
        ],
      },
      {
        id: "email",
        label: "Email",
        fields: [
          { name: "email", label: "Student email", type: "email" },
          { name: "password", label: "Password", type: "password" },
        ],
      },
      {
        id: "phone",
        label: "Phone + OTP",
        fields: [{ name: "phone", label: "Phone number", type: "tel", placeholder: "+237 6XX XXX XXX" }],
        usesOtp: true,
      },
    ],
  },
  university_student: {
    options: [
      {
        id: "regnumber",
        label: "Registration number",
        fields: [
          { name: "regNumber", label: "Registration number" },
          { name: "password", label: "Password", type: "password" },
        ],
      },
      {
        id: "email",
        label: "Institutional email",
        fields: [
          { name: "email", label: "Institutional email", type: "email" },
          { name: "password", label: "Password", type: "password" },
        ],
      },
      {
        id: "phone",
        label: "Phone + OTP",
        fields: [{ name: "phone", label: "Phone number", type: "tel", placeholder: "+237 6XX XXX XXX" }],
        usesOtp: true,
      },
    ],
  },
  parent: {
    options: [
      {
        id: "password",
        label: "Phone + Password",
        fields: [
          { name: "phone", label: "Phone number", type: "tel", placeholder: "+237 6XX XXX XXX" },
          { name: "password", label: "Password", type: "password" },
        ],
      },
      {
        id: "otp",
        label: "Phone + OTP",
        fields: [{ name: "phone", label: "Phone number", type: "tel", placeholder: "+237 6XX XXX XXX" }],
        usesOtp: true,
      },
    ],
  },
  teacher: {
    options: [
      {
        id: "staff",
        label: "Staff login",
        fields: [
          { name: "staffId", label: "Staff ID" },
          { name: "institution", label: "School / University" },
          { name: "password", label: "Password", type: "password" },
        ],
      },
    ],
  },
  school_admin: {
    mandatoryOtp: true,
    options: [
      {
        id: "admin",
        label: "Administrator login",
        fields: [
          { name: "schoolCode", label: "School code" },
          { name: "username", label: "Administrator username" },
          { name: "password", label: "Password", type: "password" },
        ],
      },
    ],
  },
  university_admin: {
    mandatoryOtp: true,
    options: [
      {
        id: "admin",
        label: "Administrator login",
        fields: [
          { name: "institutionCode", label: "Institution code" },
          { name: "username", label: "Administrator username" },
          { name: "password", label: "Password", type: "password" },
        ],
      },
    ],
  },
  police: {
    mandatoryOtp: true,
    options: [
      {
        id: "officer",
        label: "Officer login",
        fields: [
          { name: "officerNumber", label: "Officer number" },
          { name: "password", label: "Password", type: "password" },
        ],
      },
    ],
  },
  government: {
    mandatoryOtp: true,
    specialFlow: "government",
    options: [
      {
        id: "gov",
        label: "Government login",
        fields: [
          { name: "govEmail", label: "Government email", type: "email" },
          { name: "employeeId", label: "Employee ID" },
          { name: "password", label: "Password", type: "password" },
        ],
      },
    ],
  },
  health_partner: {
    options: [
      {
        id: "health",
        label: "Facility login",
        fields: [
          { name: "facilityCode", label: "Hospital / clinic code" },
          { name: "staffId", label: "Medical staff ID" },
          { name: "password", label: "Password", type: "password" },
        ],
      },
    ],
  },
  alumni: {
    options: [
      {
        id: "alumni",
        label: "Alumni login",
        fields: [
          { name: "identifier", label: "Registration number or alumni email" },
          { name: "password", label: "Password", type: "password" },
        ],
        optionalOtp: true,
      },
    ],
  },
  super_admin: {
    options: [
      {
        id: "admin",
        label: "Platform administrator login",
        fields: [
          { name: "email", label: "Administrator email", type: "email" },
          { name: "password", label: "Password", type: "password" },
        ],
      },
    ],
  },
};
