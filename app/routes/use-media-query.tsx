import { useEffect, useState } from "react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}

export default function UseMediaQueryRoute() {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  return (
    <main className="flex flex-col items-center gap-3 p-10">
      <p>
        The current media query is{" "}
        <span className="font-bold">"(max-width: 640px)"</span> and it is{" "}
        {isSmallScreen ? "matched" : "not matched"}.
      </p>
    </main>
  );
}
