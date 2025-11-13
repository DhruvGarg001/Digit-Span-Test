"use client";

import { useState } from "react";
import { AppState, TestResults } from "./types";
import { instructions } from "../data/instructions";
import WelcomeScreen from "../components/WelcomeScreen";
import InstructionsScreen from "../components/InstructionsScreen";
import TestScreen from "../components/TestScreen";
import ResultsScreen from "../components/ResultsScreen";
import ThankYouScreen from "../components/ThankYouScreen";

export default function Home() {
  // Central state management
  const [appState, setAppState] = useState<AppState>("welcome");
  const [universityId, setUniversityId] = useState("");
  const [currentInstructionStep, setCurrentInstructionStep] = useState(0);
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  // Handle ID submission
  const handleIdSubmit = (id: string) => {
    setUniversityId(id);
    localStorage.setItem("universityId", id);
    setAppState("instructions");
  };

  // Handle instruction navigation
  const handleInstructionNext = () => {
    if (currentInstructionStep < instructions.length - 1) {
      setCurrentInstructionStep(currentInstructionStep + 1);
    } else {
      // Last instruction, move to test
      setAppState("test");
    }
  };

  // Handle test completion
  const handleTestComplete = (results: TestResults) => {
    setTestResults(results);
    // Save to localStorage as backup
    localStorage.setItem("testResults", JSON.stringify(results));
    setAppState("results");
  };

  // Handle restart
  const handleRestart = () => {
    setAppState("welcome");
    setUniversityId("");
    setTestResults(null);
    setCurrentInstructionStep(0);
    localStorage.removeItem("universityId");
    localStorage.removeItem("testResults");
  };

  // Handle complete
  const handleComplete = () => {
    setAppState("thankyou");
  };

  return (
    <div className="flex min-h-screen items-center bg-stone-50 justify-center p-4">
      <main className="flex w-full max-w-4xl flex-col gap-8 rounded-md bg-white p-8 shadow-sm md:p-12">
        {appState === "welcome" && (
          <WelcomeScreen onSubmit={handleIdSubmit} />
        )}
        
        {appState === "instructions" && (
          <InstructionsScreen 
            currentStep={currentInstructionStep}
            instructions={instructions}
            onNext={handleInstructionNext}
          />
        )}
        
        {appState === "test" && (
          <TestScreen 
            universityId={universityId}
            onComplete={handleTestComplete}
          />
        )}

        {appState === "results" && testResults && (
          <ResultsScreen 
            results={testResults} 
            onRestart={handleRestart}
            onComplete={handleComplete}
          />
        )}

        {appState === "thankyou" && (
          <ThankYouScreen />
        )}
      </main>
    </div>
  );
}
