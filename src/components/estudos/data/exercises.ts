import { Beaker, BookOpen, Brain, Calculator, Globe } from "lucide-react";
import { type Exercise } from "@/components/estudos/type/exercise";

const exercises: Exercise[] = [
  {
    id: 1,
    subject: "Matemática",
    question: "Qual é o resultado de 2³ + 5?",
    options: ["11", "13", "15", "17"],
    correctAnswer: 1,
    icon: Calculator,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    subject: "Química",
    question: "Qual é a fórmula química da água?",
    options: ["CO2", "H2O", "O2", "NaCl"],
    correctAnswer: 1,
    icon: Beaker,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    subject: "Geografia",
    question: "Qual é a capital da França?",
    options: ["Londres", "Paris", "Roma", "Berlim"],
    correctAnswer: 1,
    icon: Globe,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    subject: "Física",
    question: "Qual é a velocidade da luz no vácuo?",
    options: [
      "300.000 km/s",
      "150.000 km/s",
      "500.000 km/s",
      "100.000 km/s",
    ],
    correctAnswer: 0,
    icon: Brain,
    color: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    subject: "Português",
    question: 'Qual é o plural de "cidadão"?',
    options: ["cidadãos", "cidadães", "cidadões", "cidadans"],
    correctAnswer: 0,
    icon: BookOpen,
    color: "from-indigo-500 to-purple-500",
  },
];

export default exercises;
