import { useEffect, useState } from "react";

function useOrientation() {
  const [orientation, setOrientation] = useState<ScreenOrientation | null>(
    null
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.screen.orientation);
    };

    // Set the initial orientation
    handleOrientationChange();

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return orientation;
}

export default function UseOrientationRoute() {
  const orientation = useOrientation();

  return (
    <main className="flex flex-col items-center gap-3 p-10">
      <p>
        The current orientation is{" "}
        <span className="font-bold">{orientation?.type}</span> and the angle is{" "}
        <span className="font-bold">{orientation?.angle}</span>.
      </p>
    </main>
  );
}
