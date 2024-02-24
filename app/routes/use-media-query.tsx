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
      <h1 className="text-5xl font-bold">Hooks</h1>
      <p className="text-2xl">50 React Hooks built from scratch</p>

      <h2 className="text-3xl font-bold">useMediaQuery</h2>
      <p>
        useMediaQuery is a hook that tracks the state of a media query. It
        returns a boolean value that indicates whether the media query is
        currently matched.
      </p>

      <p>
        The current media query is{" "}
        <span className="font-bold">"(max-width: 640px)"</span> and it is{" "}
        {isSmallScreen ? "matched" : "not matched"}.
      </p>
    </main>
  );
}
