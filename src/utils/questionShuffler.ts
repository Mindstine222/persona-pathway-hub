
import { MBTIQuestion } from "@/data/mbtiQuestions";

export interface ShuffledQuestion extends MBTIQuestion {
  originalIndex: number;
}

// Seeded random number generator for consistent shuffling
function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const shuffleQuestions = (questions: MBTIQuestion[], seed: number = Math.random()): ShuffledQuestion[] => {
  // Create array with original indices
  const questionsWithIndices: ShuffledQuestion[] = questions.map((question, index) => ({
    ...question,
    originalIndex: index
  }));

  // Fisher-Yates shuffle algorithm with seeded random
  const shuffled = [...questionsWithIndices];
  let currentSeed = seed;
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    currentSeed = seededRandom(currentSeed * 1000); // Generate next seed
    const j = Math.floor(currentSeed * (i + 1));
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
