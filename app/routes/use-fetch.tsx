import { useEffect, useState } from "react";

export function useFetch<Data>(url: string) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    if (!url) return;
    setStatus("loading");

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data as Data);
        setStatus("success");
      })
      .catch((error) => {
        setError(error);
        setStatus("error");
      });
  }, [url]);

  return { error, isLoading: status === "loading", data };
}

function Card({
  loading,
  error,
  data,
}: {
  loading: boolean;
  error: unknown;
  data: {
    name: string;
    sprites: {
      front_default: string;
    };
  } | null;
}) {
  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (error instanceof Error) {
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg p-5 bg-white">
      <h1 className="font-bold text-xl mb-2">{data.name}</h1>
      <img
        className="w-full"
        src={data.sprites.front_default}
        alt={data.name}
      />
    </div>
  );
}

export default function UseFetchRoute() {
  const [count, setCount] = useState(1);

  const { error, isLoading, data } = useFetch<{
    name: string;
    sprites: {
      front_default: string;
    };
  }>(`https://pokeapi.co/api/v2/pokemon/${count}`);

  return (
    <section className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">useFetch</h1>
      <div className="flex space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={count < 2}
          onClick={() => setCount((c) => c - 1)}
        >
          Prev
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={() => setCount((c) => c + 1)}
        >
          Next
        </button>
      </div>
      <Card loading={isLoading} error={error} data={data} />
    </section>
  );
}
