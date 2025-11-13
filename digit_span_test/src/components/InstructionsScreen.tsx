"use client";

import { useEffect } from "react";
import { Instruction } from "@/app/types";

interface InstructionsScreenProps {
  currentStep: number;
  instructions: Instruction[];
  onNext: () => void;
}

export default function InstructionsScreen({ 
  currentStep, 
  instructions, 
  onNext 
}: InstructionsScreenProps) {
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onNext]);

  const currentInstruction = instructions[currentStep];
  const isLastStep = currentStep === instructions.length - 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-8">
      {/* Progress Indicator */}
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {instructions.length}
          </span>
          <span className="text-sm text-gray-600">
            Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Space</kbd> to continue
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#18543a] transition-all duration-300"
            style={{ width: `${((currentStep + 1) / instructions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Instruction Content */}
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 md:p-12 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            {currentInstruction.title}
          </h2>
          <div className="text-md text-gray-700 leading-relaxed text-center whitespace-pre-line">
            {currentInstruction.content}
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <button
        onClick={onNext}
        className="px-8 py-2 bg-(--dark-green-color) cursor-pointer text-white font-semibold rounded-md hover:bg-(--hover-dark-green-color) transition-colors focus:outline-none focus:ring-0"
      >
        {isLastStep ? "Start Test" : "Next"}
      </button>
    </div>
  );
}
