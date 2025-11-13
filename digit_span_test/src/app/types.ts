// Types for the Digit Span Test application

export type AppState = 
  | "welcome"           // Initial page with ID input
  | "instructions"      // Showing instructions
  | "test"              // Running the test
  | "results"           // Showing results
  | "thankyou";         // Thank you screen

export type TestCondition = "forward" | "backward";

export type TestPhase = "transition" | "showing" | "input";

export interface Instruction {
  id: number;
  title: string;
  content: string;
}

export interface Trial {
  sequence: number[];
  userResponse: string;
  correctDigits: number;  // Number of digits placed correctly in order
  isFullyCorrect: boolean; // Whether the entire sequence was correct
  length: number;
  trialNumber: number; // 1 or 2 for each length
  condition: TestCondition;
  timestamp: number;
}

export interface TestResults {
  universityId: string;
  forwardTrials: Trial[];
  backwardTrials: Trial[];
  forwardTotalResponses: number;
  forwardTotalCorrect: number;
  forwardMaxSpan: number; // Highest length fully correct
  backwardTotalResponses: number;
  backwardTotalCorrect: number;
  backwardMaxSpan: number; // Highest length fully correct
  completedAt: Date;
}

// For graph data
export interface DigitsCorrectByCondition {
  condition: TestCondition;
  totalDigitsShown: number;
  correctDigitsPlaced: number;
}

export interface MaxSpanByCondition {
  condition: TestCondition;
  maxSpan: number;
}
