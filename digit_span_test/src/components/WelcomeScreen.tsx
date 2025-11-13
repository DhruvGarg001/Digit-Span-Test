"use client";

import { useState } from "react";
import Image from "next/image";

interface WelcomeScreenProps {
  onSubmit: (universityId: string) => void;
}

export default function WelcomeScreen({ onSubmit }: WelcomeScreenProps) {
  const [universityId, setUniversityId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (universityId.trim()) {
      onSubmit(universityId.trim());
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col items-center border-b border-gray-200 pb-8">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">
          Digit Span Test
        </h1>
        <p className="text-center text-md text-gray-600 max-w-2xl">
          An online psychology experiment designed to measure working memory capacity
        </p>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col items-center gap-8">
        {/* University ID Form */}
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="universityId" className="text-center text-xl font-semibold text-gray-800">
                Please Enter Your University ID
              </label>
              <p className="text-center text-sm text-gray-600">
                Your ID will be stored locally for the duration of this experiment.
              </p>
            </div>
            <input
              type="text"
              id="universityId"
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
              placeholder="University ID"
              className="rounded-md border border-gray-300 px-4 py-3 text-center text-lg hover:ring-1 hover:ring-stone-400 transition-all duration-200 focus:ring-1 focus:outline-none focus:ring-black"
              required
            />
            <button
              type="submit"
              className="rounded-md bg-(--dark-green-color) cursor-pointer px-6 py-3 text-lg font-semibold tracking-wide text-white transition-colors hover:bg-(--hover-dark-green-color) focus:outline-none focus:ring-0"
            >
              Begin Experiment
            </button>
          </form>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Photo */}
          <div className="shrink-0 mx-auto md:mx-0">
            <Image
              src="/dhruv_profile_photo.jpg"
              alt="Dhruv Garg"
              width={500}
              height={500}
              className="rounded-full w-24 h-auto border-2 border-[#18543a]"
              priority
            />
          </div>
          
          {/* Disclaimer Text */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Disclaimer & Project Information</h2>
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>Developer:</strong> This experiment was developed by{" "}
                <a 
                  href="https://www.linkedin.com/in/dhruvgarg001/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
                >
                  Dhruv Garg
                </a>
                , a student at Michigan State University.
              </p>
              <p>
                <strong>Academic Purpose:</strong> This project was created as part of the Honors Option for PSY 200 (Introduction to Psychology) for the Fall 2025 semester.
              </p>
              <p>
                <strong>License:</strong> This project is released under the{" "}
                <a 
                  href="https://opensource.org/licenses/MIT" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
                >
                  MIT License
                </a>
                .
              </p>
              <p>
                <strong>Data Privacy:</strong> Your University ID is stored locally on your device using browser localStorage. No data is transmitted to external servers during this experiment.
              </p>
              <p>
                <strong>Project Documentation:</strong>
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  <a 
                    href="https://drive.google.com/file/d/16Vd1rPjxyo2d69F7UikXBG3goB2WSwxQ/view?usp=sharing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1"
                  >
                    Project Details (Introduction, Methods, & Results)
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://drive.google.com/file/d/1ZdsiaaOwVKNxkO45rqh2Xnanz9tHTDBx/view?usp=sharing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1"
                  >
                    Experiment Background & Questions
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </li>
              </ul>
              <p>
                <strong>Contact:</strong>{" "}
                <a 
                  href="https://www.linkedin.com/in/dhruvgarg001/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1"
                >
                  Connect on LinkedIn
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
