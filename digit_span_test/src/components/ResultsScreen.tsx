"use client";

import { TestResults } from "../app/types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { ArrowRight, Check, X, RotateCcw, CheckCircle } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ResultsScreenProps {
  results: TestResults;
  onRestart: () => void;
  onComplete: () => void;
}

export default function ResultsScreen({ results, onRestart, onComplete }: ResultsScreenProps) {
  // Calculate total digits shown and correct digits placed
  const forwardTotalDigitsShown = results.forwardTrials.reduce((sum, t) => sum + t.length, 0);
  const forwardCorrectDigitsPlaced = results.forwardTrials.reduce((sum, t) => sum + t.correctDigits, 0);
  
  const backwardTotalDigitsShown = results.backwardTrials.reduce((sum, t) => sum + t.length, 0);
  const backwardCorrectDigitsPlaced = results.backwardTrials.reduce((sum, t) => sum + t.correctDigits, 0);

  // Calculate accuracy percentages
  const forwardAccuracy = forwardTotalDigitsShown > 0 
    ? (forwardCorrectDigitsPlaced / forwardTotalDigitsShown * 100).toFixed(1)
    : "0.0";
  
  const backwardAccuracy = backwardTotalDigitsShown > 0
    ? (backwardCorrectDigitsPlaced / backwardTotalDigitsShown * 100).toFixed(1)
    : "0.0";

  // Graph 1: Correct Digits Placed by Condition
  const correctDigitsData = {
    labels: ["Forward Span", "Backward Span"],
    datasets: [
      {
        label: "Total Digits Shown",
        data: [forwardTotalDigitsShown, backwardTotalDigitsShown],
        backgroundColor: "rgba(156, 163, 175, 0.6)",
        borderColor: "rgba(156, 163, 175, 1)",
        borderWidth: 2,
      },
      {
        label: "Correct Digits Placed",
        data: [forwardCorrectDigitsPlaced, backwardCorrectDigitsPlaced],
        backgroundColor: "rgba(24, 84, 58, 0.8)",
        borderColor: "rgba(24, 84, 58, 1)",
        borderWidth: 2,
      }
    ]
  };

  // Graph 2: Max Span by Condition
  const maxSpanData = {
    labels: ["Forward Span", "Backward Span"],
    datasets: [
      {
        label: "Maximum Span Achieved",
        data: [results.forwardMaxSpan, results.backwardMaxSpan],
        backgroundColor: ["rgba(24, 84, 58, 0.8)", "rgba(79, 70, 229, 0.8)"],
        borderColor: ["rgba(24, 84, 58, 1)", "rgba(79, 70, 229, 1)"],
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: "Number of Digits"
        }
      }
    }
  };

  const maxSpanChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: "Sequence Length"
        }
      }
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h1>
        <p className="text-gray-600">Participant ID: {results.universityId}</p>
        <p className="text-sm text-gray-500">
          Completed: {new Date(results.completedAt).toLocaleString()}
        </p>
      </div>

      {/* Downloadable Section */}
      <div className="bg-white p-8">
        {/* Title for Downloaded Image */}
        <div className="text-center mb-8 pb-4 border-b-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Results for the Digit Span Experiment
          </h2>
          <p className="text-lg text-gray-700">
            Participant ID: {results.universityId}
          </p>
          <p className="text-md text-gray-600">
            Date: {new Date(results.completedAt).toLocaleDateString("en-US", { 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Forward Span Summary */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Forward Digit Span</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Trials:</span>
              <span className="font-semibold">{results.forwardTotalResponses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fully Correct:</span>
              <span className="font-semibold">{results.forwardTotalCorrect}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate:</span>
              <span className="font-semibold">
                {((results.forwardTotalCorrect / results.forwardTotalResponses) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-gray-600">Maximum Span:</span>
              <span className="font-bold text-lg text-[#18543a]">{results.forwardMaxSpan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Correct Digits Placed:</span>
              <span className="font-semibold">
                {forwardCorrectDigitsPlaced} / {forwardTotalDigitsShown} ({forwardAccuracy}%)
              </span>
            </div>
          </div>
        </div>

        {/* Backward Span Summary */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Backward Digit Span</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Trials:</span>
              <span className="font-semibold">{results.backwardTotalResponses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fully Correct:</span>
              <span className="font-semibold">{results.backwardTotalCorrect}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate:</span>
              <span className="font-semibold">
                {((results.backwardTotalCorrect / results.backwardTotalResponses) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-gray-600">Maximum Span:</span>
              <span className="font-bold text-lg text-indigo-600">{results.backwardMaxSpan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Correct Digits Placed:</span>
              <span className="font-semibold">
                {backwardCorrectDigitsPlaced} / {backwardTotalDigitsShown} ({backwardAccuracy}%)
              </span>
            </div>
          </div>
        </div>
      </div>

        {/* Charts */}
        <div className="space-y-8">
        {/* Chart 1: Correct Digits Placed */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Digit Placement Accuracy by Condition
          </h3>
          <div className="max-w-2xl mx-auto">
            <Bar data={correctDigitsData} options={chartOptions} />
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Shows total digits presented vs. correctly placed in correct positions
          </p>
        </div>

        {/* Chart 2: Maximum Span */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Maximum Span Achieved by Condition
          </h3>
          <div className="max-w-2xl mx-auto">
            <Bar data={maxSpanData} options={maxSpanChartOptions} />
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Highest sequence length correctly recalled (Scale: 0-10)
          </p>
        </div>
        </div>
      </div>

      {/* Calculation Explanations */}
      <details className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <summary className="cursor-pointer font-semibold text-gray-900 hover:text-[#18543a]">
          📊 View Graph Calculation Details
        </summary>
        
        <div className="space-y-4 text-sm mt-4">
          {/* Graph 1 Explanation */}
          <div className="bg-white p-4 rounded border border-blue-100">
            <h4 className="font-semibold text-gray-800 mb-2">Graph 1: Digit Placement Accuracy</h4>
            <p className="text-gray-700 mb-2">
              <strong>What it measures:</strong> How many individual digits were placed in the correct position, regardless of whether the entire sequence was correct.
            </p>
            <div className="ml-4 space-y-2">
              <div>
                <strong className="text-[#18543a]">Forward Span:</strong>
                <ul className="list-disc ml-6 mt-1">
                  <li>Total Digits Shown: {forwardTotalDigitsShown} (sum of all sequence lengths)</li>
                  <li>Correct Digits Placed: {forwardCorrectDigitsPlaced} (digits in correct positions)</li>
                  <li>Accuracy: {forwardAccuracy}%</li>
                </ul>
                <p className="text-xs text-gray-600 mt-1 italic">
                  Example: Sequence [3,7,9,2], User enters &quot;3892&quot; → 3 correct (positions 0,2,3)
                </p>
              </div>
              
              <div>
                <strong className="text-indigo-600">Backward Span:</strong>
                <ul className="list-disc ml-6 mt-1">
                  <li>Total Digits Shown: {backwardTotalDigitsShown}</li>
                  <li>Correct Digits Placed: {backwardCorrectDigitsPlaced}</li>
                  <li>Accuracy: {backwardAccuracy}%</li>
                </ul>
                <p className="text-xs text-gray-600 mt-1 italic">
                  Example: Sequence [3,7,9,2] (reversed to [2,9,7,3]), User enters &quot;2973&quot; → 4 correct (all positions)
                </p>
              </div>
            </div>
          </div>

          {/* Graph 2 Explanation */}
          <div className="bg-white p-4 rounded border border-blue-100">
            <h4 className="font-semibold text-gray-800 mb-2">Graph 2: Maximum Span Achieved</h4>
            <p className="text-gray-700 mb-2">
              <strong>What it measures:</strong> The longest sequence length where at least one trial was 100% correct.
            </p>
            <div className="ml-4 space-y-2">
              <div>
                <strong className="text-[#18543a]">Forward Max Span:</strong> {results.forwardMaxSpan}
                <p className="text-xs text-gray-600 mt-1">
                  {results.forwardMaxSpan > 0 
                    ? `Successfully recalled at least one ${results.forwardMaxSpan}-digit sequence correctly`
                    : "No sequences recalled completely correctly"}
                </p>
              </div>
              
              <div>
                <strong className="text-indigo-600">Backward Max Span:</strong> {results.backwardMaxSpan}
                <p className="text-xs text-gray-600 mt-1">
                  {results.backwardMaxSpan > 0
                    ? `Successfully recalled at least one ${results.backwardMaxSpan}-digit sequence in reverse`
                    : "No sequences recalled completely correctly"}
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white p-4 rounded border border-blue-100">
            <h4 className="font-semibold text-gray-800 mb-2">📈 Key Metrics Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-semibold text-[#18543a] mb-1">Forward Span:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Trials completed: {results.forwardTotalResponses}</li>
                  <li>Fully correct sequences: {results.forwardTotalCorrect}</li>
                  <li>Individual digits correct: {forwardCorrectDigitsPlaced}/{forwardTotalDigitsShown}</li>
                  <li>Digit accuracy: {forwardAccuracy}%</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-indigo-600 mb-1">Backward Span:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Trials completed: {results.backwardTotalResponses}</li>
                  <li>Fully correct sequences: {results.backwardTotalCorrect}</li>
                  <li>Individual digits correct: {backwardCorrectDigitsPlaced}/{backwardTotalDigitsShown}</li>
                  <li>Digit accuracy: {backwardAccuracy}%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </details>

      {/* Trial Details (Optional - can be collapsed) */}
      <details className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
        <summary className="cursor-pointer font-semibold text-gray-900 hover:text-[#18543a]">
          View Detailed Trial Results
        </summary>
        <div className="mt-4 space-y-6">
          {/* Forward Trials */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Forward Span Trials:</h4>
            <div className="space-y-1 text-sm">
              {results.forwardTrials.map((trial, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span className="text-gray-600">
                    Trial {idx + 1} (Length {trial.length}):
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="font-mono">{trial.sequence.join(" ")}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="font-mono">{trial.userResponse || "(empty)"}</span>
                    <span className="text-gray-600 text-xs">({trial.correctDigits}/{trial.length})</span>
                    {trial.isFullyCorrect ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Backward Trials */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Backward Span Trials:</h4>
            <div className="space-y-1 text-sm">
              {results.backwardTrials.map((trial, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-200">
                  <span className="text-gray-600">
                    Trial {idx + 1} (Length {trial.length}):
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="font-mono">{trial.sequence.join(" ")}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="font-mono">{[...trial.sequence].reverse().join(" ")}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="font-mono">{trial.userResponse || "(empty)"}</span>
                    <span className="text-gray-600 text-xs">({trial.correctDigits}/{trial.length})</span>
                    {trial.isFullyCorrect ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={onRestart}
          className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Restart Test
        </button>
        <button
          onClick={onComplete}
          className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-[#18543a] text-white font-semibold rounded-md hover:bg-[#134430] transition-colors"
        >
          <CheckCircle className="w-5 h-5" />
          Done
        </button>
      </div>
    </div>
  );
}
