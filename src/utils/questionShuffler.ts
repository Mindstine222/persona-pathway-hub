
import { MBTIQuestion } from "@/data/mbtiQuestions";

export interface ShuffledQuestion extends MBTIQuestion {
  originalIndex: number;
}

export const shuffleQuestions = (questions: MBTIQuestion[]): ShuffledQuestion[] => {
  // Create array with original indices
  const questionsWithIndices: ShuffledQuestion[] = questions.map((question, index) => ({
    ...question,
    originalIndex: index
  }));

  // Fisher-Yates shuffle algorithm
  const shuffled = [...questionsWithIndices];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

export const mapShuffledResponsesToOriginalOrder = (
  responses: number[],
  shuffledQuestions: ShuffledQuestion[]
): number[] => {
  const originalResponses = new Array(93).fill(0);
  
  responses.forEach((response, shuffledIndex) => {
    const originalIndex = shuffledQuestions[shuffledIndex].originalIndex;
    originalResponses[originalIndex] = response;
  });

  return originalResponses;
};
