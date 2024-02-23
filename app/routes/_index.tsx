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
];

export default function Index() {
  return (
    <main className="flex flex-col items-center gap-3 p-10">
      <h1 className="text-5xl font-bold">Hooks</h1>
      <p className="text-2xl">50 React Hooks built from scratch</p>
      <ul className="flex items-center mt-6 gap-8">
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
