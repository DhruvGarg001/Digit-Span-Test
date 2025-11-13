"use client";

import { useEffect, useState, useCallback } from "react";
import { TestCondition, TestPhase, Trial, TestResults } from "../app/types";
import { getSequence } from "../data/sequences";

interface TestScreenProps {
  universityId: string;
  onComplete: (results: TestResults) => void;
}

const MIN_LENGTH = 2;
const MAX_LENGTH = 10;
const TRIALS_PER_LENGTH = 2;
const DIGIT_DISPLAY_TIME = 1000; // 1 second per digit

export default function TestScreen({ universityId, onComplete }: TestScreenProps) {
  // Test state
  const [condition, setCondition] = useState<TestCondition>("forward");
  const [phase, setPhase] = useState<TestPhase>("transition");
  const [currentLength, setCurrentLength] = useState(MIN_LENGTH);
  const [currentTrial, setCurrentTrial] = useState(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  
  // Results tracking
  const [forwardTrials, setForwardTrials] = useState<Trial[]>([]);
  const [backwardTrials, setBackwardTrials] = useState<Trial[]>([]);
  
  // Calculate correct digits - count ALL matching digits in correct positions
  const calculateCorrectDigits = (sequence: string[], userResponse: string, isBackward: boolean): number => {
    const userDigits = userResponse.split("");
    const expectedSequence = isBackward ? [...sequence].reverse() : sequence;
    let correctCount = 0;
    
    // Count all digits in correct positions (not just consecutive from start)
    for (let i = 0; i < expectedSequence.length; i++) {
      if (userDigits[i] && expectedSequence[i] === userDigits[i]) {
        correctCount++;
      }
    }
    
    return correctCount;
  };

  // Start a new trial
  const startNewTrial = useCallback(() => {
    const newSequence = getSequence(currentLength, currentTrial);
    setSequence(newSequence);
    setDisplayIndex(0);
    setUserInput("");
    setPhase("showing");
  }, [currentLength, currentTrial]);

  // Handle showing digits
  useEffect(() => {
    if (phase === "showing") {
      if (displayIndex <= sequence.length) {
        const timer = setTimeout(() => {
          if (displayIndex === sequence.length) {
            // All digits have been shown, move to input
            setPhase("input");
          } else {
            // Show next digit
            setDisplayIndex(displayIndex + 1);
          }
        }, DIGIT_DISPLAY_TIME);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, displayIndex, sequence.length]);

  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isBackward = condition === "backward";
    const expectedSequence = isBackward ? [...sequence].reverse() : sequence;
    const correctDigits = calculateCorrectDigits(sequence, userInput, isBackward);
    const isFullyCorrect = userInput === expectedSequence.join("");
    const currentTimestamp = new Date().getTime();
    
    // Convert string[] to number[] for Trial type
    const sequenceNumbers = sequence.map(s => parseInt(s));
    
    const trial: Trial = {
      sequence: sequenceNumbers,
      userResponse: userInput,
      correctDigits,
      isFullyCorrect,
      length: currentLength,
      trialNumber: currentTrial,
      condition,
      timestamp: currentTimestamp
    };
    
    // Save trial and update state
    if (condition === "forward") {
      const updatedTrials = [...forwardTrials, trial];
      setForwardTrials(updatedTrials);
      
      // Check if we should continue
      processNextStep(updatedTrials, backwardTrials);
    } else {
      const updatedTrials = [...backwardTrials, trial];
      setBackwardTrials(updatedTrials);
      
      // Check if we should continue
      processNextStep(forwardTrials, updatedTrials);
    }
  };

  // Process next step based on current state
  const processNextStep = (currentForwardTrials: Trial[], currentBackwardTrials: Trial[]) => {
    const currentTrials = condition === "forward" ? currentForwardTrials : currentBackwardTrials;
    const currentLengthTrials = currentTrials.filter(t => t.length === currentLength);
    
    // Decision logic - NO EARLY STOPPING, run all trials
    if (currentLengthTrials.length < TRIALS_PER_LENGTH) {
      // More trials needed at this length
      setCurrentTrial(currentTrial + 1);
      setPhase("transition");
    } else if (currentLength < MAX_LENGTH) {
      // Continue to next length (regardless of success/failure)
      setCurrentLength(currentLength + 1);
      setCurrentTrial(1);
      setPhase("transition");
    } else {
      // Reached max length - move to next condition or end
      if (condition === "forward") {
        setCondition("backward");
        setCurrentLength(MIN_LENGTH);
        setCurrentTrial(1);
        setPhase("transition");
      } else {
        // Test complete - all trials done
        finishTestWithResults({ forward: currentForwardTrials, backward: currentBackwardTrials });
      }
    }
  };

  // Finish test and compile results
  const finishTestWithResults = (finalResults: { forward: Trial[], backward: Trial[] }) => {
    const forwardMaxSpan = Math.max(
      0,
      ...finalResults.forward.filter(t => t.isFullyCorrect).map(t => t.length)
    );
    
    const backwardMaxSpan = Math.max(
      0,
      ...finalResults.backward.filter(t => t.isFullyCorrect).map(t => t.length)
    );
    
    const results: TestResults = {
      universityId,
      forwardTrials: finalResults.forward,
      backwardTrials: finalResults.backward,
      forwardTotalResponses: finalResults.forward.length,
      forwardTotalCorrect: finalResults.forward.filter(t => t.isFullyCorrect).length,
      forwardMaxSpan,
      backwardTotalResponses: finalResults.backward.length,
      backwardTotalCorrect: finalResults.backward.filter(t => t.isFullyCorrect).length,
      backwardMaxSpan,
      completedAt: new Date()
    };
    
    onComplete(results);
  };

  // Handle Enter key in transition phase
  useEffect(() => {
    if (phase === "transition") {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          startNewTrial();
        }
      };
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [phase, currentLength, currentTrial, startNewTrial]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
      {/* Progress Info */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span className="font-semibold">
            {condition === "forward" ? "Forward Span" : "Backward Span"}
          </span>
          <span>
            Length: {currentLength} | Trial: {currentTrial}/{TRIALS_PER_LENGTH}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#18543a] transition-all duration-300"
            style={{ 
              width: `${(
                (condition === "forward" 
                  ? (currentLength - MIN_LENGTH) * TRIALS_PER_LENGTH + currentTrial
                  : (MAX_LENGTH - MIN_LENGTH + 1) * TRIALS_PER_LENGTH + (currentLength - MIN_LENGTH) * TRIALS_PER_LENGTH + currentTrial
                ) / ((MAX_LENGTH - MIN_LENGTH + 1) * TRIALS_PER_LENGTH * 2)
              ) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      {phase === "transition" && (
        <div className="text-center">
          {/* Show intro screen when starting new condition */}
          {currentLength === MIN_LENGTH && currentTrial === 1 ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {condition === "forward" ? "Forward Digit Span Test" : "Backward Digit Span Test"}
              </h2>
              <div className="max-w-2xl mx-auto mb-8 space-y-4 text-left">
                <p className="text-lg text-gray-700">
                  {condition === "forward" 
                    ? "You will see a series of digits displayed one at a time."
                    : "You will see a series of digits displayed one at a time."}
                </p>
                <p className="text-lg text-gray-700">
                  {condition === "forward" 
                    ? "Your task is to remember them and type them back in the SAME order."
                    : "Your task is to remember them and type them back in REVERSE order."}
                </p>
                <p className="text-lg text-gray-700">
                  The sequences will start short and gradually get longer.
                </p>
                {condition === "backward" && (
                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-md text-yellow-800">
                      <strong>Important:</strong> For backward span, if you see 3-7-9, you should type 9-7-3
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={startNewTrial}
                className="px-8 py-3 bg-[#18543a] text-white font-semibold rounded-md hover:bg-[#134430] transition-colors text-lg"
              >
                Start {condition === "forward" ? "Forward" : "Backward"} Span Test
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {condition === "forward" ? "Forward Digit Span" : "Backward Digit Span"}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                {condition === "forward" 
                  ? "Remember the digits in the same order they appear."
                  : "Remember the digits in reverse order."}
              </p>
              <p className="text-md text-gray-500 mb-8">
                Length: {currentLength} digits | Trial {currentTrial} of {TRIALS_PER_LENGTH}
              </p>
              <button
                onClick={startNewTrial}
                className="px-8 py-3 bg-[#18543a] text-white font-semibold rounded-md hover:bg-[#134430] transition-colors"
              >
                Ready - Press Enter or Click
              </button>
            </>
          )}
        </div>
      )}

      {phase === "showing" && (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-8">Watch carefully...</p>
          <div className="text-9xl font-bold text-gray-900 min-h-[200px] flex items-center justify-center">
            {displayIndex < sequence.length ? sequence[displayIndex] : " "}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {Math.min(displayIndex + 1, sequence.length)} / {sequence.length}
          </p>
        </div>
      )}

      {phase === "input" && (
        <div className="text-center w-full max-w-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {condition === "forward" 
              ? "Enter the digits in order:"
              : "Enter the digits in reverse order:"}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Type the digits"
              className="rounded-md border border-gray-300 px-4 py-3 text-center text-lg hover:ring-1 hover:ring-stone-400 transition-all duration-200 focus:ring-1 focus:outline-none focus:ring-black"
              autoFocus
              maxLength={currentLength}
            />
            <button
              type="submit"
              className="px-6 py-3 cursor-pointer bg-(--dark-green-color) text-white font-semibold rounded-md hover:bg-(--hover-dark-green-color) transition-colors"
            >
              Submit (Press Enter)
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            Expected {currentLength} digits
          </p>
        </div>
      )}
    </div>
  );
}
