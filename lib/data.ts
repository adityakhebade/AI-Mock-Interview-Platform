export type InterviewType = "Behavioral" | "Technical" | "System Design" | "Case Study";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type InterviewStatus = "completed" | "in-progress" | "upcoming" | "failed";

export interface InterviewSession {
  id: string;
  type: InterviewType;
  difficulty: Difficulty;
  duration: number;
  score: number;
  status: InterviewStatus;
  date: string;
  role: string;
  questionsAnswered: number;
  totalQuestions: number;
}

export interface Resume {
  id: string;
  name: string;
  uploadedAt: string;
  size: string;
  isPrimary: boolean;
}

export interface Question {
  id: string;
  prompt: string;
  type: InterviewType;
  difficulty: Difficulty;
  answer: string;
  score?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
}

export const interviews: InterviewSession[] = [
  {
    id: "iv_01",
    type: "Behavioral",
    difficulty: "Medium",
    duration: 30,
    score: 82,
    status: "completed",
    date: "2026-07-09T10:00:00Z",
    role: "Senior Product Manager",
    questionsAnswered: 8,
    totalQuestions: 8,
  },
  {
    id: "iv_02",
    type: "Technical",
    difficulty: "Hard",
    duration: 45,
    score: 74,
    status: "completed",
    date: "2026-07-07T14:00:00Z",
    role: "Backend Engineer",
    questionsAnswered: 6,
    totalQuestions: 6,
  },
  {
    id: "iv_03",
    type: "System Design",
    difficulty: "Hard",
    duration: 60,
    score: 0,
    status: "in-progress",
    date: "2026-07-11T09:00:00Z",
    role: "Staff Engineer",
    questionsAnswered: 3,
    totalQuestions: 7,
  },
  {
    id: "iv_04",
    type: "Behavioral",
    difficulty: "Easy",
    duration: 30,
    score: 91,
    status: "completed",
    date: "2026-07-05T11:00:00Z",
    role: "Product Manager",
    questionsAnswered: 8,
    totalQuestions: 8,
  },
  {
    id: "iv_05",
    type: "Case Study",
    difficulty: "Medium",
    duration: 45,
    score: 58,
    status: "failed",
    date: "2026-07-02T16:00:00Z",
    role: "Strategy Consultant",
    questionsAnswered: 5,
    totalQuestions: 6,
  },
  {
    id: "iv_06",
    type: "Technical",
    difficulty: "Medium",
    duration: 45,
    score: 0,
    status: "upcoming",
    date: "2026-07-14T13:00:00Z",
    role: "Full Stack Engineer",
    questionsAnswered: 0,
    totalQuestions: 7,
  },
];

export const resumes: Resume[] = [
  {
    id: "r1",
    name: "Resume_Senior_PM.pdf",
    uploadedAt: "2026-06-28",
    size: "248 KB",
    isPrimary: true,
  },
  {
    id: "r2",
    name: "Resume_Engineering.pdf",
    uploadedAt: "2026-06-15",
    size: "312 KB",
    isPrimary: false,
  },
];

export const questions: Question[] = [
  {
    id: "q1",
    prompt:
      "Tell me about a time you had to influence a team decision without having direct authority. What was the situation and outcome?",
    type: "Behavioral",
    difficulty: "Medium",
    answer:
      "In my previous role, I noticed our onboarding flow had a 40% drop-off rate. I gathered data, built a proposal, and presented it to the product and engineering leads. By framing it around revenue impact and user research, I got alignment to prioritize a redesign, which reduced drop-off to 18%.",
    score: 88,
    feedback:
      "Strong STAR structure. You clearly articulated the situation, your specific actions, and a measurable outcome. Consider leading with the quantified impact to hook the interviewer faster.",
    strengths: ["Clear measurable outcome", "Proactive data gathering", "Cross-functional alignment"],
    improvements: ["Lead with the impact metric", "Tighten the situation narrative"],
  },
  {
    id: "q2",
    prompt: "Describe a conflict you had with a coworker and how you resolved it.",
    type: "Behavioral",
    difficulty: "Easy",
    answer:
      "A coworker and I disagreed on the architecture for a new service. I scheduled a 1:1 to understand their concerns, shared my reasoning, and we agreed on a hybrid approach that addressed both scalability and time-to-market.",
    score: 76,
    feedback:
      "Good resolution, but the stakes and trade-offs could be sharper. Quantify the impact of the chosen architecture to strengthen the answer.",
    strengths: ["Collaborative approach", "Concrete resolution"],
    improvements: ["Quantify the trade-off", "Show the long-term result"],
  },
  {
    id: "q3",
    prompt: "Walk me through how you would design a URL shortener like bit.ly.",
    type: "System Design",
    difficulty: "Hard",
    answer:
      "I would start with requirements: read-heavy workload, 100M URLs, 10x reads. Use base62 encoding, a counter service for ID generation, and a cache layer for hot URLs. Sharding by ID prefix for write scaling.",
    score: 71,
    feedback:
      "Solid foundation and good mention of caching. You jumped to the solution quickly — spend more time clarifying constraints and capacity estimates before diving into components.",
    strengths: ["Considered read/write ratio", "Mentioned caching and sharding"],
    improvements: ["Clarify capacity estimates first", "Discuss failure modes and monitoring"],
  },
];

export const performanceTrend = [
  { label: "Jun 28", value: 62 },
  { label: "Jul 02", value: 58 },
  { label: "Jul 05", value: 91 },
  { label: "Jul 07", value: 74 },
  { label: "Jul 09", value: 82 },
];

export const skillBreakdown = [
  { skill: "Communication", value: 88 },
  { skill: "Problem Solving", value: 76 },
  { skill: "Technical Depth", value: 71 },
  { skill: "Leadership", value: 84 },
  { skill: "Structure", value: 79 },
];
