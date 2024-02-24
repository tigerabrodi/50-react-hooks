import { useState, useEffect } from "react";

type ScriptStatus = "loading" | "ready" | "error";

function useScript(
  src: string,
  options?: { removeOnUnmount?: boolean }
): ScriptStatus {
  const [status, setStatus] = useState<ScriptStatus>(src ? "loading" : "error");

  const setReady = () => setStatus("ready");
  const setError = () => setStatus("error");

  useEffect(() => {
    let script: HTMLScriptElement | null = document.querySelector(
      `script[src="${src}"]`
    );

    if (!script) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);

      script.addEventListener("load", setReady);
      script.addEventListener("error", setError);
    } else {
      setStatus("ready");
    }

    return () => {
      if (script) {
        script.removeEventListener("load", setReady);
        script.removeEventListener("error", setError);

        if (options?.removeOnUnmount) {
          script.remove();
        }
      }
    };
  }, [src, options?.removeOnUnmount]);

  return status;
}

export default function UseScriptRoute() {
  const status = useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/mootools/1.6.0/mootools-core.js"
  );

  return (
    <section className="p-4">
      <h1 className="text-lg font-semibold">useScript Hook Example</h1>
      <p className="mt-2">
        Script load status:{" "}
        <span
          className={`font-medium ${
            status === "ready" ? "text-green-500" : "text-red-500"
          }`}
        >
          {status}
        </span>
      </p>
    </section>
  );
}
