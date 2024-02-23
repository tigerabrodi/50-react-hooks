import { useState, useEffect } from "react";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number | null;
    height: number | null;
  }>({
    width: null,
    height: null,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    // Needed because we're using SSR first framework
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export default function UseWindowSizeRoute() {
  const size = useWindowSize();

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold">Window Size</h1>
      <div className="mt-2">
        {size.width && size.height ? (
          <p className="text-sm">
            Width: {size.width}, Height: {size.height}
          </p>
        ) : (
          <p className="text-sm">Loading window size...</p>
        )}
      </div>
    </div>
  );
}
