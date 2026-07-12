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
