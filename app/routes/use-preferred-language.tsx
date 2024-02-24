import { useEffect, useState } from "react";
import { ClientOnly } from "remix-utils/client-only";

function usePreferredLanguage() {
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => {
      setLanguage(navigator.language);
    };

    // Set the initial language
    handler();

    window.addEventListener("languagechange", handler);

    return () => {
      window.removeEventListener("languagechange", handler);
    };
  }, []);

  return language;
}

export default function UsePreferredLanguage() {
  const language = usePreferredLanguage();

  return (
    <ClientOnly>
      {() => (
        <div>
          <h1>usePreferredLanguage</h1>
          <p>Change language here - chrome://settings/languages</p>
          <h2>
            The correct date format for <pre>{language}</pre> is{" "}
            {language && (
              <time>{new Date(Date.now()).toLocaleDateString(language)}</time>
            )}
          </h2>
        </div>
      )}
    </ClientOnly>
  );
}
