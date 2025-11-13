"use client";

export default function ThankYouScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center gap-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Thank You
      </h1>
      <p className="text-xl text-gray-700 max-w-2xl">
        Your participation is complete.
      </p>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>You may now close this window.</p>
      </div>
    </div>
  );
}
