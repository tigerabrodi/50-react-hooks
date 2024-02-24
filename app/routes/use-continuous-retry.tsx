import { useState, useEffect, useCallback } from "react";

interface UseContinuousRetryOptions {
  interval?: number;
  maxRetries?: number;
}

function useContinuousRetry(
  callback: () => boolean,
  interval: number = 100,
  options: UseContinuousRetryOptions = {}
) {
  const [hasResolved, setHasResolved] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const maxRetries = options.maxRetries;

  // Using useCallback, the function retains the same reference across renders,
  // unless its dependencies change. This stability prevents unnecessary re-executions
  // of effects or callbacks that depend on this function, controlling the retry behavior as expected.
  // Without useCallback, the function would be re-created on every render, even if its dependencies haven't changed.
  const attemptRetry = useCallback(() => {
    if (callback()) {
      setHasResolved(true);
      return;
    }
    setRetryCount((count) => count + 1);
  }, [callback]);

  useEffect(() => {
    const hasRetryReachedLimit =
      maxRetries !== undefined && retryCount >= maxRetries;
    if (hasResolved || hasRetryReachedLimit) {
      return;
    }

    const id = setInterval(attemptRetry, interval);

    return () => clearInterval(id);
  }, [attemptRetry, hasResolved, interval, maxRetries, retryCount]);

  return hasResolved;
}

export default function UseContinuousRetryRoute() {
  const [count, setCount] = useState(0);
  const hasResolved = useContinuousRetry(() => count > 10, 1000, {
    maxRetries: 5,
  });

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">useContinuousRetry</h1>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        onClick={() => setCount(count + 1)}
      >
        Increment ({count})
      </button>
      <div className="mt-4">
        <pre className="bg-white p-2 rounded">
          {JSON.stringify({ hasResolved, count }, null, 2)}
        </pre>
      </div>
    </section>
  );
}
