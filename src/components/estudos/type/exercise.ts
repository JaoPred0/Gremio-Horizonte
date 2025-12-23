import { type LucideIcon } from "lucide-react";

export type Exercise = {
  id: number;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  icon: LucideIcon;
  color: string;
};
