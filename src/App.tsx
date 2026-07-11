import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { AccountShell } from "@/layouts/AccountShell";
import { StudentDashboard } from "@/features/student/dashboard/StudentDashboard";

import { SplashScreen } from "@/features/auth/SplashScreen";
import { Onboarding } from "@/features/auth/Onboarding";
import { LanguageSelect } from "@/features/auth/LanguageSelect";
import { WelcomeScreen } from "@/features/auth/WelcomeScreen";
import { RoleSelect } from "@/features/auth/RoleSelect";
import { RoleLogin } from "@/features/auth/RoleLogin";
import { OtpVerification } from "@/features/auth/OtpVerification";
import { BiometricLogin } from "@/features/auth/BiometricLogin";
import { CompleteProfile } from "@/features/auth/CompleteProfile";
import { ForgotPassword } from "@/features/auth/ForgotPassword";
import { GuestDiplomaVerification } from "@/features/auth/GuestDiplomaVerification";

import { SecuritySettings } from "@/features/account/SecuritySettings";
import { DeviceManagement } from "@/features/account/DeviceManagement";
import { SessionManagement } from "@/features/account/SessionManagement";

import { SchoolDashboard } from "@/features/school/SchoolDashboard";
import { Students } from "@/features/school/Students";
import { Teachers } from "@/features/school/Teachers";
import { Admissions } from "@/features/school/Admissions";
import { Classes } from "@/features/school/Classes";
import { Finance } from "@/features/school/Finance";
import { Examinations } from "@/features/school/Examinations";
import { Certificates } from "@/features/school/Certificates";
import { Library } from "@/features/school/Library";
import { Transport } from "@/features/school/Transport";
import { Discipline } from "@/features/school/Discipline";
import { Announcements } from "@/features/school/Announcements";
import { SchoolSettings } from "@/features/school/SchoolSettings";

import { ParentDashboard } from "@/features/parent/ParentDashboard";
import { ChildrenOverview } from "@/features/parent/ChildrenOverview";
import { Attendance as ParentAttendance } from "@/features/parent/Attendance";
import { Grades } from "@/features/parent/Grades";
import { Payments } from "@/features/parent/Payments";
import { TransportTracking } from "@/features/parent/TransportTracking";
import { Health } from "@/features/parent/Health";
import { Messages } from "@/features/parent/Messages";
import { EmergencyAlerts } from "@/features/parent/EmergencyAlerts";

import { TeacherDashboard } from "@/features/teacher/TeacherDashboard";
import { TeacherClasses } from "@/features/teacher/TeacherClasses";
import { TeacherAttendance } from "@/features/teacher/TeacherAttendance";
import { Assignments as TeacherAssignments } from "@/features/teacher/Assignments";
import { Grading } from "@/features/teacher/Grading";
import { Timetable } from "@/features/teacher/Timetable";
import { TeacherMessages } from "@/features/teacher/TeacherMessages";

import { UniversityDashboard } from "@/features/university/UniversityDashboard";
import { UniversityStudents } from "@/features/university/UniversityStudents";
import { UniversityFaculty } from "@/features/university/UniversityFaculty";
import { Programs } from "@/features/university/Programs";
import { UniversityExaminations } from "@/features/university/UniversityExaminations";
import { Diplomas } from "@/features/university/Diplomas";
import { UniversityFinance } from "@/features/university/UniversityFinance";
import { UniversitySettings } from "@/features/university/UniversitySettings";

import { PoliceDashboard } from "@/features/police/PoliceDashboard";
import { SosAlerts } from "@/features/police/SosAlerts";
import { MissingStudents } from "@/features/police/MissingStudents";
import { Geofencing } from "@/features/police/Geofencing";
import { QrScanner } from "@/features/police/QrScanner";
import { IncidentReports } from "@/features/police/IncidentReports";
import { ResponseHistory } from "@/features/police/ResponseHistory";

import { NationalDashboard } from "@/features/government/NationalDashboard";
import { GovernmentSchools } from "@/features/government/GovernmentSchools";
import { GovernmentUniversities } from "@/features/government/GovernmentUniversities";
import { Statistics } from "@/features/government/Statistics";
import { DropoutAnalysis } from "@/features/government/DropoutAnalysis";
import { Funding } from "@/features/government/Funding";
import { PublicDiplomaVerification } from "@/features/government/PublicDiplomaVerification";

import { HealthDashboard } from "@/features/health/HealthDashboard";
import { MedicalRecords } from "@/features/health/MedicalRecords";
import { Vaccinations } from "@/features/health/Vaccinations";
import { Telemedicine } from "@/features/health/Telemedicine";
import { HealthSosPage } from "@/features/health/HealthSosPage";
import { MedicalReports } from "@/features/health/MedicalReports";

import { AlumniDashboard } from "@/features/alumni/AlumniDashboard";
import { AlumniDirectory } from "@/features/alumni/AlumniDirectory";
import { AlumniDiplomaVerification } from "@/features/alumni/AlumniDiplomaVerification";
import { Mentorship } from "@/features/alumni/Mentorship";
import { AlumniEvents } from "@/features/alumni/AlumniEvents";

import { SuperAdminDashboard } from "@/features/admin/SuperAdminDashboard";
import { MultiSchoolManagement } from "@/features/admin/MultiSchoolManagement";
import { UsersRbac } from "@/features/admin/UsersRbac";
import { AuditLogs } from "@/features/admin/AuditLogs";
import { SystemMonitoring } from "@/features/admin/SystemMonitoring";
import { Integrations } from "@/features/admin/Integrations";
import { BackupRestore } from "@/features/admin/BackupRestore";
import { PlatformSettings } from "@/features/admin/PlatformSettings";

// NOTE — Phase 1: role shells + routing wired for all 10 roles.
// Phase 2: complete authentication flow + account/security area.
// Phase 3: full School Administration module (dashboard, students,
// teachers, admissions, classes, finance, examinations, certificates
// with blockchain verification, library, transport, discipline,
// announcements, settings) — built on shared DataTable/PageHeader/
// StatCard components to avoid duplication across modules.
// Phase 4: full Parent module (dashboard, children overview, attendance,
// AI grade prediction, payments/wallet, transport tracking, health + SOS,
// messages, emergency alerts).
// Phase 5: full Teacher module (dashboard, classes, interactive attendance
// marking, assignments, editable gradebook, timetable, messages).
// Phase 6: full University Admin module (dashboard, students, faculty,
// programs, examinations, blockchain diplomas + public verification
// lookup, finance, settings).
// Phase 7: full Police module (emergency dashboard, SOS alerts with live
// dispatch, missing students, geo-fencing, QR identity scanner, incident
// reports, response history) and full Government module (national
// dashboard, schools/universities oversight, statistics & heatmaps,
// AI dropout analysis, funding & compliance, public diploma verification).
// Phase 8 (final): full Health Partner module (dashboard, medical records,
// vaccinations, telemedicine, SOS button, medical reports), full Alumni
// module (dashboard, network directory, diploma verification, mentorship,
// events), and full Super Administrator module (system dashboard,
// multi-school management, users & RBAC, audit logs, system monitoring,
// integrations & API keys, backup & restore, platform settings).
//
// All 10 roles are now fully built end-to-end: Student, Parent, Teacher,
// School Administration, University Administration, Police, Government,
// Health Partner, Alumni, Super Administrator — plus the complete
// authentication flow and shared account/security area.

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<SplashScreen />} />

        {/* Authentication flow */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/language" element={<LanguageSelect />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/onboarding/role" element={<RoleSelect />} />
        <Route path="/auth/login" element={<RoleLogin />} />
        <Route path="/auth/otp" element={<OtpVerification />} />
        <Route path="/auth/biometric" element={<BiometricLogin />} />
        <Route path="/auth/complete-profile" element={<CompleteProfile />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/guest/diploma-verification" element={<GuestDiplomaVerification />} />

        {/* Account & security (post-login, shared across roles) */}
        <Route path="/account" element={<AccountShell />}>
          <Route index element={<Navigate to="security" replace />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="devices" element={<DeviceManagement />} />
          <Route path="sessions" element={<SessionManagement />} />
        </Route>

        <Route path="/student" element={<AppShell role="student" />}>
          <Route index element={<StudentDashboard />} />
        </Route>

        <Route path="/school" element={<AppShell role="school_admin" />}>
          <Route index element={<SchoolDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="classes" element={<Classes />} />
          <Route path="finance" element={<Finance />} />
          <Route path="examinations" element={<Examinations />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="library" element={<Library />} />
          <Route path="transport" element={<Transport />} />
          <Route path="discipline" element={<Discipline />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="settings" element={<SchoolSettings />} />
        </Route>

        <Route path="/parent" element={<AppShell role="parent" />}>
          <Route index element={<ParentDashboard />} />
          <Route path="children" element={<ChildrenOverview />} />
          <Route path="attendance" element={<ParentAttendance />} />
          <Route path="grades" element={<Grades />} />
          <Route path="payments" element={<Payments />} />
          <Route path="transport" element={<TransportTracking />} />
          <Route path="health" element={<Health />} />
          <Route path="messages" element={<Messages />} />
          <Route path="alerts" element={<EmergencyAlerts />} />
        </Route>

        <Route path="/teacher" element={<AppShell role="teacher" />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="grading" element={<Grading />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="messages" element={<TeacherMessages />} />
        </Route>

        <Route path="/university" element={<AppShell role="university_admin" />}>
          <Route index element={<UniversityDashboard />} />
          <Route path="students" element={<UniversityStudents />} />
          <Route path="faculty" element={<UniversityFaculty />} />
          <Route path="programs" element={<Programs />} />
          <Route path="examinations" element={<UniversityExaminations />} />
          <Route path="diplomas" element={<Diplomas />} />
          <Route path="finance" element={<UniversityFinance />} />
          <Route path="settings" element={<UniversitySettings />} />
        </Route>

        <Route path="/police" element={<AppShell role="police" />}>
          <Route index element={<PoliceDashboard />} />
          <Route path="sos" element={<SosAlerts />} />
          <Route path="missing-students" element={<MissingStudents />} />
          <Route path="geofencing" element={<Geofencing />} />
          <Route path="qr-scanner" element={<QrScanner />} />
          <Route path="incidents" element={<IncidentReports />} />
          <Route path="history" element={<ResponseHistory />} />
        </Route>

        <Route path="/government" element={<AppShell role="government" />}>
          <Route index element={<NationalDashboard />} />
          <Route path="schools" element={<GovernmentSchools />} />
          <Route path="universities" element={<GovernmentUniversities />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="dropout-analysis" element={<DropoutAnalysis />} />
          <Route path="funding" element={<Funding />} />
          <Route path="diploma-verification" element={<PublicDiplomaVerification />} />
        </Route>

        <Route path="/health" element={<AppShell role="health_partner" />}>
          <Route index element={<HealthDashboard />} />
          <Route path="records" element={<MedicalRecords />} />
          <Route path="vaccinations" element={<Vaccinations />} />
          <Route path="telemedicine" element={<Telemedicine />} />
          <Route path="sos" element={<HealthSosPage />} />
          <Route path="reports" element={<MedicalReports />} />
        </Route>

        <Route path="/alumni" element={<AppShell role="alumni" />}>
          <Route index element={<AlumniDashboard />} />
          <Route path="network" element={<AlumniDirectory />} />
          <Route path="diploma" element={<AlumniDiplomaVerification />} />
          <Route path="mentorship" element={<Mentorship />} />
          <Route path="events" element={<AlumniEvents />} />
        </Route>

        <Route path="/admin" element={<AppShell role="super_admin" />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="schools" element={<MultiSchoolManagement />} />
          <Route path="rbac" element={<UsersRbac />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="monitoring" element={<SystemMonitoring />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="backup" element={<BackupRestore />} />
          <Route path="settings" element={<PlatformSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
