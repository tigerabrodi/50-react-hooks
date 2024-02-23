import { useState, useEffect, useRef } from "react";

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Returns the previous value (happens before update in useEffect above)
  return ref.current;
}

export default function UsePreviousRoute() {
  const [count, setCount] = useState<number>(0);
  const previousCount = usePrevious(count);

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold">usePrevious Example</h1>
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={() => setCount((prevCount) => prevCount + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-150"
        >
          Increment
        </button>
        <div className="text-sm">
          <p>Current Count: {count}</p>
          <p>Previous Count: {previousCount}</p>
        </div>
      </div>
    </div>
  );
}
