import type { ChangeEvent } from "react";
import { useState } from "react";
import { useDebounce } from "~/hooks/useDebounce";

export default function UseDebounce() {
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
