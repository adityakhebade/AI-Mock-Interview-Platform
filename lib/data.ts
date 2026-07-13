// Type definitions only — no mock data.
// All data must be fetched from the database/API using real user context.

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

export interface PerformanceTrendPoint {
  label: string;
  value: number;
}

export interface SkillBreakdownItem {
  skill: string;
  value: number;
}
