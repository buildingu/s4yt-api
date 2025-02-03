export interface MultipleChoice {
  question: string;
  answers: {
    choices: Record<string, string>;
    correct: string;
    explanation: string;
  }
}