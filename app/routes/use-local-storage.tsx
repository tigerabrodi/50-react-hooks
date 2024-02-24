import { useState } from "react";
import { ClientOnly } from "remix-utils/client-only";

function useLocalStorage<InitialValue>(
  key: string,
  initialValue: InitialValue
) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (
    value: InitialValue | ((value: InitialValue) => InitialValue)
  ) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default function LocalStorageRoute() {
  const [name, setName] = useLocalStorage("name", "John Doe");

  return (
    <ClientOnly>
      {() => (
        <div>
          <h1>useLocalStorage Hook Example</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p>Your name is stored in local storage: {name}</p>
        </div>
      )}
    </ClientOnly>
  );
}
