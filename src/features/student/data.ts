export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: string;
  status: "available" | "borrowed" | "reserved";
  dueDate?: string;
}

export const LIBRARY_BOOKS: LibraryBook[] = [
  { id: "LIB-1", title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest, Stein", category: "Computer Science", status: "borrowed", dueDate: "Jul 22, 2026" },
  { id: "LIB-2", title: "Things Fall Apart", author: "Chinua Achebe", category: "Literature", status: "available" },
  { id: "LIB-3", title: "Precis de Mathematiques — Terminale C", author: "Ministère de l'Éducation", category: "Mathematics", status: "available" },
  { id: "LIB-4", title: "A Short History of Cameroon", author: "Victor Julius Ngoh", category: "History", status: "reserved" },
  { id: "LIB-5", title: "Organic Chemistry Fundamentals", author: "Paula Bruice", category: "Chemistry", status: "available" },
  { id: "LIB-6", title: "Clean Code", author: "Robert C. Martin", category: "Computer Science", status: "available" },
];

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: "POR-1", title: "Campus Attendance Tracker (school project)", category: "Software", description: "A small Python app that logs class attendance and exports a weekly summary.", date: "May 2026" },
  { id: "POR-2", title: "Regional Science Fair — 2nd place", category: "Award", description: "Solar-powered water filtration prototype presented at the Littoral regional science fair.", date: "Mar 2026" },
  { id: "POR-3", title: "Debate Club — Best Speaker", category: "Extracurricular", description: "Recognized for outstanding performance at the inter-school debate tournament.", date: "Nov 2025" },
];

export interface CommunityPost {
  id: string;
  author: string;
  group: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
}

export const COMMUNITY_POSTS: CommunityPost[] = [
  { id: "COM-1", author: "Junior Mbeki", group: "Form 5 — Science Stream", content: "Anyone has notes from yesterday's chemistry lab? I missed the last 20 minutes.", time: "2h ago", likes: 4, comments: 3 },
  { id: "COM-2", author: "Ndeye Sow", group: "Coding Club", content: "We're meeting Thursday at 4pm in Room 12 to prep for the regional hackathon — bring your laptops!", time: "5h ago", likes: 11, comments: 6 },
  { id: "COM-3", author: "Blaise Kamdem", group: "Form 5 — Science Stream", content: "Reminder: physics lab report is due Friday, not Monday. Mr. Fotso confirmed in class today.", time: "Yesterday", likes: 8, comments: 1 },
];

export interface StudentMessage {
  id: string;
  from: string;
  role: string;
  preview: string;
  time: string;
  unread: boolean;
}

export const STUDENT_MESSAGES: StudentMessage[] = [
  { id: "SM-1", from: "Mr. Jean Fotso", role: "Mathematics Teacher", preview: "Well done on the Term 2 exam — 78/100 puts you well above the class average.", time: "Yesterday", unread: true },
  { id: "SM-2", from: "School Administration", role: "Lycée Bilingue de Douala", preview: "Term 3 resumes on July 20th. Please confirm your class schedule in the portal.", time: "2 days ago", unread: true },
  { id: "SM-3", from: "Coding Club", role: "Extracurricular", preview: "Reminder: regional hackathon registration closes this Friday.", time: "3 days ago", unread: false },
];

export interface CareerPath {
  id: string;
  title: string;
  matchScore: number;
  description: string;
  skills: string[];
}

export const CAREER_PATHS: CareerPath[] = [
  { id: "CP-1", title: "Software Engineering", matchScore: 92, description: "Strong fit based on your Mathematics and coding club performance. High demand across Cameroon's growing tech sector.", skills: ["Algorithms", "Problem solving", "Python"] },
  { id: "CP-2", title: "Data Science", matchScore: 84, description: "Your analytical strengths in Mathematics translate well — consider pairing with Statistics electives next term.", skills: ["Statistics", "Mathematics", "Data analysis"] },
  { id: "CP-3", title: "Civil Engineering", matchScore: 71, description: "Solid Physics results support this path; recommended if infrastructure and construction projects interest you.", skills: ["Physics", "Design", "Mathematics"] },
];
