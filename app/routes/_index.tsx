import type { MetaFunction } from "@vercel/remix";

export const meta: MetaFunction = () => {
  return [
    { title: "50 React hooks from scratch" },
    {
      name: "description",
      content: "Building and documenting 50 react hooks from scratch",
    },
  ];
};

const hooks = [
  {
    name: "useDebounce",
    description:
      "Delay the execution of function or state update with useDebounce.",
    id: "use-debounce",
  },
  {
    name: "useLocalStorage",
    description:
      "Persist state to local storage and keep it synchronized with useLocalStorage.",
    id: "use-local-storage",
  },
  {
    name: "useWindowSize",
    description:
      "Track the dimensions of the browser window with useWindowSize.",
    id: "use-window-size",
  },
  {
    name: "usePrevious",
    description: "Access the previous value of a state with usePrevious.",
    id: "use-previous",
  },
  {
    name: "useIntersectionObserver",
    description:
      "Track the visibility of an element with useIntersectionObserver.",
    id: "use-intersection-observer",
  },
  {
    name: "useNetworkState",
    description:
      "Monitor and adapt to network conditions seamlessly with useNetworkState.",
    id: "use-network-state",
  },
  {
    name: "useMediaQuery",
    description: "Track the state of a media query with useMediaQuery.",
    id: "use-media-query",
  },
  {
    name: "useOrientation",
    description: "Track the orientation of the device with useOrientation.",
    id: "use-orientation",
  },
  {
    name: "useSessionStorage",
    description: "Persist state to session storage with useSessionStorage.",
    id: "use-session-storage",
  },
  {
    name: "usePreferredLanguage",
    description:
      "Detect the user's preferred language with usePreferredLanguage.",
    id: "use-preferred-language",
  },
  {
    name: "useFetch",
    description: "Fetch data with ease and flexibility with useFetch.",
    id: "use-fetch",
  },
];

export default function Index() {
  return (
    <main className="flex flex-col items-center gap-3 p-10 w-8/12">
      <h1 className="text-5xl font-bold">Hooks</h1>
      <p className="text-2xl">50 React Hooks built from scratch</p>
      <ul className="flex items-center mt-6 gap-8 flex-wrap">
        {hooks.map((hook) => (
          <li key={hook.id}>
            <a href={`/${hook.id}`} className="text-blue-600 underline">
              {hook.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
