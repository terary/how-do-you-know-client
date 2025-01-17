import { User } from "../../types";

export interface Question {
  id: string;
  text: string;
  type: "text" | "multiple_choice" | "boolean";
  options?: string[];
}

export interface Questionnaire {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdBy: User;
  createdAt: string;
}

export interface UserResponse {
  questionId: string;
  answer: string | boolean | number;
  timestamp: string;
}
