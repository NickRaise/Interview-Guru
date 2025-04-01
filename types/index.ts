export type FormType = "sign-in" | "sign-up";

export interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techStack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
}

export interface InterviewCardProps {
  interviewId: string;
  role: string;
  level: string;
  questions: string[];
  techStack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
}

export interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

export interface TechIconProps {
  techStack: string[];
}

export interface SignUpParams {
  uid: string,
  name: string,
  email: string,
  password: string
}

export interface SignInParams {
  email: string,
  idToken: string
}