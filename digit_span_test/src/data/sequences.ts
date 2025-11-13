// Pre-generated sequences for digit span test
// Each sequence has no consecutive repeating digits
// Format: { length: number, sequences: string[][] }

export const digitSequences = {
  2: [
    ["3", "7"],
    ["5", "2"],
  ],
  3: [
    ["4", "9", "2"],
    ["7", "3", "8"],
  ],
  4: [
    ["6", "2", "9", "4"],
    ["3", "8", "1", "5"],
  ],
  5: [
    ["5", "3", "8", "1", "9"],
    ["2", "7", "4", "9", "6"],
  ],
  6: [
    ["7", "4", "2", "8", "5", "1"],
    ["9", "3", "6", "1", "7", "4"],
  ],
  7: [
    ["4", "9", "6", "2", "7", "3", "8"],
    ["8", "1", "5", "9", "2", "6", "4"],
  ],
  8: [
    ["5", "2", "9", "1", "7", "4", "8", "3"],
    ["6", "9", "3", "7", "2", "5", "1", "8"],
  ],
  9: [
    ["3", "8", "5", "2", "9", "6", "1", "7", "4"],
    ["7", "2", "6", "4", "1", "8", "3", "9", "5"],
  ],
  10: [
    ["9", "4", "7", "2", "5", "8", "1", "6", "3", "4"],
    ["2", "8", "3", "6", "9", "1", "5", "7", "4", "8"],
  ],
};

// Helper function to get sequence
export function getSequence(length: number, trialNumber: number): string[] {
  const sequences = digitSequences[length as keyof typeof digitSequences];
  if (!sequences || trialNumber < 1 || trialNumber > sequences.length) {
    throw new Error(`Invalid sequence request: length ${length}, trial ${trialNumber}`);
  }
  return sequences[trialNumber - 1];
}
