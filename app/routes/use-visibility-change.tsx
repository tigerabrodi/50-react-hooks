import { useState, useEffect } from "react";

function useVisibilityChange() {
  const [documentVisible, setDocumentVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setDocumentVisible(document.visibilityState === "visible");
    };

    // Set the initial state
    handleVisibilityChange();

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return documentVisible;
}

export default function UseVisibilityChangeRoute() {
  const documentVisible = useVisibilityChange();
  const [tabAwayCount, setTabAwayCount] = useState(0);

  useEffect(() => {
    if (!documentVisible) {
      setTabAwayCount((c) => c + 1);
    }
  }, [documentVisible]);

  return (
    <section className="p-4">
      <h1 className="text-xl font-bold">useVisibilityChange</h1>
      <div className="mt-2 text-lg">Tab Away Count: {tabAwayCount}</div>
    </section>
  );
}
