"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { ShieldAlert, Timer } from "lucide-react";
import { LIMIT } from "@/lib/rateLimiter";

function getInitialSeconds(
  searchParams: ReturnType<typeof useSearchParams>,
): number {
  const retry = searchParams.get("retry");
  const n = retry ? parseInt(retry, 10) : 60;
  return Number.isFinite(n) && n > 0 ? n : 60;
}

function RateLimitedContent() {
  const searchParams = useSearchParams();
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getInitialSeconds(searchParams),
  );

  const tick = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) return 0;
      return prev - 1;
    });
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [secondsLeft, tick]);

  return (
    <div className="min-h-screen bg-neo-bg font-sans text-neo-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-4 border-neo-black p-8 shadow-neo-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-900/30 border-4 border-neo-black">
            <ShieldAlert className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">
          Too many requests
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You’ve exceeded the limit of {LIMIT} requests per minute. Please wait
          before trying again.
        </p>
        {secondsLeft > 0 ? (
          <div className="flex items-center justify-center gap-2 text-lg font-bold mb-6">
            <Timer className="w-5 h-5" />
            <span>
              Try again in {secondsLeft} second{secondsLeft !== 1 ? "s" : ""}
            </span>
          </div>
        ) : (
          <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-6">
            You can try again now.
          </p>
        )}
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-neo-yellow border-4 border-neo-black font-bold uppercase tracking-tighter hover:bg-neo-blue transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function RateLimitedFallback() {
  return (
    <div className="min-h-screen bg-neo-bg font-sans text-neo-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-4 border-neo-black p-8 shadow-neo-lg text-center animate-pulse">
        <div className="h-32 mb-6 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto w-32" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4 mx-auto" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-full" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/2 mx-auto" />
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-40 mx-auto" />
      </div>
    </div>
  );
}

export default function RateLimitedPage() {
  return (
    <Suspense fallback={<RateLimitedFallback />}>
      <RateLimitedContent />
    </Suspense>
  );
}
