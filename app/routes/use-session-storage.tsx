import { useEffect, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";

function useSessionStorage<InitialValue>(
  key: string,
  initialValue: InitialValue
) {
  const [value, setValue] = useState<InitialValue>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    const storedValue = sessionStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    setValue(
      JSON.parse(sessionStorage.getItem(key) || JSON.stringify(initialValue))
    );
  }, [initialValue, key]);

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export default function UseSessionStorageRoute() {
  const [value, setValue] = useSessionStorage("count", 0);

  return (
    <ClientOnly>
      {() => (
        <div>
          <h1>useSessionStorage</h1>
          <p>Count: {value}</p>
          <button onClick={() => setValue(value + 1)} className="mr-7">
            Increment
          </button>
          <button onClick={() => setValue(value - 1)}>Decrement</button>
        </div>
      )}
    </ClientOnly>
  );
}
