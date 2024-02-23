import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function UseDebounceRoute() {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        className="border-2 border-gray-200 p-2 rounded-md"
        placeholder="Search..."
        onChange={handleSearch}
      />
      <p className="mt-2 text-gray-700">
        Debounced Search Term: {debouncedSearchTerm}
      </p>
    </div>
  );
}
