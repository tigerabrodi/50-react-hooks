import { useState, useEffect, useRef } from "react";

export default function UseIntersectionObserverRoute() {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.9,
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-y-scroll">
      <div className="h-[100vh] w-full text-center" />

      <div
        ref={ref}
        className="mx-auto p-5 border-2 border-gray-200 rounded-lg w-64"
      >
        {entry?.isIntersecting
          ? "✅ Visible in viewport!"
          : "❌ Not visible yet."}
      </div>
    </div>
  );
}

function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      options
    );

    // Copy ref.current to a variable
    // This is because ref.current may refer to a different element by the time the cleanup function runs
    // This was a warning by React
    // According to this Github issue: https://github.com/facebook/react/issues/15841
    // It's nothing to actually worry about
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options]);

  return [ref, entry] as const;
}
