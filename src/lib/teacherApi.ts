import { apiClient } from "./apiClient";

export interface TeacherDashboard {
  fullName: string;
  classesTaught: number;
  totalStudents: number;
  assignmentsToGrade: number;
  examsGraded: number;
  classes: { id: string; name: string; studentCount: number; room: string | null }[];
}

export interface TeacherClass {
  id: string;
  name: string;
  room: string | null;
  studentCount: number;
}

export interface TeacherClassStudent {
  id: string;
  fullName: string;
}

export interface TeacherAssignment {
  id: string;
  title: string;
  className: string | null;
  dueDate: string;
  status: "scheduled" | "in_progress" | "graded";
}

export interface AssignmentGradeRow {
  studentId: string;
  studentName: string;
  score: number | null;
  maxScore: number;
}

export interface AttendanceForClass {
  date: string;
  students: { studentId: string; studentName: string; status: "present" | "absent" | "late" | null }[];
}

export interface TimetableEntry {
  id: string;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
  startTime: string;
  endTime: string;
  className: string;
  room: string | null;
}

export const teacherApi = {
  getDashboard: (token: string) => apiClient.get<TeacherDashboard>("/teacher/me/dashboard", token),
  getClasses: (token: string) => apiClient.get<TeacherClass[]>("/teacher/me/classes", token),
  getClassStudents: (token: string, classId: string) =>
    apiClient.get<TeacherClassStudent[]>(`/teacher/me/classes/${classId}/students`, token),

  getAssignments: (token: string) => apiClient.get<TeacherAssignment[]>("/teacher/me/assignments", token),
  createAssignment: (token: string, payload: { name: string; classRoomId: string; date: string }) =>
    apiClient.post<TeacherAssignment>("/teacher/me/assignments", payload, token),
  updateAssignmentStatus: (token: string, id: string, status: string) =>
    apiClient.patch<TeacherAssignment>(`/teacher/me/assignments/${id}`, { status }, token),

  getAssignmentGrades: (token: string, examId: string) =>
    apiClient.get<AssignmentGradeRow[]>(`/teacher/me/assignments/${examId}/grades`, token),
  gradeStudent: (token: string, examId: string, payload: { studentId: string; score: number; maxScore?: number }) =>
    apiClient.post(`/teacher/me/assignments/${examId}/grades`, payload, token),

  getAttendance: (token: string, classId: string, date?: string) =>
    apiClient.get<AttendanceForClass>(`/teacher/me/classes/${classId}/attendance${date ? `?date=${date}` : ""}`, token),
  markAttendance: (
    token: string,
    payload: { classRoomId: string; date: string; entries: { studentId: string; status: "present" | "absent" | "late" }[] }
  ) => apiClient.post("/teacher/me/attendance", payload, token),

  getTimetable: (token: string) => apiClient.get<TimetableEntry[]>("/teacher/me/timetable", token),
  createTimetableEntry: (token: string, payload: { classRoomId: string; day: string; startTime: string; endTime: string }) =>
    apiClient.post<TimetableEntry>("/teacher/me/timetable", payload, token),
};
