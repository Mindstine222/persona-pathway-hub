
import { mbtiQuestions } from "@/data/mbtiQuestions";

export interface MBTIScores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

export interface MBTIResult {
  type: string;
  scores: MBTIScores;
}

export const calculateMBTIType = (responses: number[]): MBTIResult => {
  const scores: MBTIScores = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
  };

  responses.forEach((response, index) => {
    const question = mbtiQuestions[index];
    if (!question) return;

    // Convert response (1-5) to score (-2 to +2)
    const score = response - 3;

    switch (question.dimension) {
      case 'EI':
        if (question.direction === 'positive') {
          scores.E += score;
          scores.I -= score;
        } else {
          scores.I += score;
          scores.E -= score;
        }
        break;
      case 'SN':
        if (question.direction === 'positive') {
          scores.S += score;
          scores.N -= score;
        } else {
          scores.N += score;
          scores.S -= score;
        }
        break;
      case 'TF':
        if (question.direction === 'positive') {
          scores.T += score;
          scores.F -= score;
        } else {
          scores.F += score;
          scores.T -= score;
        }
        break;
      case 'JP':
        if (question.direction === 'positive') {
          scores.J += score;
          scores.P -= score;
        } else {
          scores.P += score;
          scores.J -= score;
        }
        break;
    }
  });

  // Normalize scores to positive values
  const normalizedScores = {
    E: scores.E + 46, // 23 questions * 2 max score
    I: scores.I + 46,
    S: scores.S + 46, // 23 questions * 2 max score  
    N: scores.N + 46,
    T: scores.T + 46, // 23 questions * 2 max score
    F: scores.F + 46,
    J: scores.J + 48, // 24 questions * 2 max score
    P: scores.P + 48
  };

  // Determine type
  const type = 
    (normalizedScores.E > normalizedScores.I ? 'E' : 'I') +
    (normalizedScores.S > normalizedScores.N ? 'S' : 'N') +
    (normalizedScores.T > normalizedScores.F ? 'T' : 'F') +
    (normalizedScores.J > normalizedScores.P ? 'J' : 'P');

  return {
    type,
    scores: normalizedScores
  };
};
