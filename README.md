# 50 React Hooks Explained

<details>
  <summary>🍿 useDebounce</summary>

---

This one is pretty straightforward.

Every time value changes, we set a timeout to update the debounced value after the specified delay.

However, if value keeps changing, we clear the timeout and set a new one.

This means if you keep typing for a whole second without stopping, the debounced value will only be updated once at the end.

```tsx
function useDebounce(value: string, delay: number) {
  // State to hold the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Handler to set debouncedValue to value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timeout if the value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

</details>

<details>
  <summary>🍿 useLocalStorage</summary>

---

Here we start off by getting the value from localStorage, if it exists.

Using a function with the useState hook in React for the initial state is known as "lazy initialization."

This method is handy when setting up the initial state takes a lot of work or relies on outside sources, like local storage. With this approach, React runs the function only once when the component first loads, enhancing performance by skipping extra work on future renders.

When users set a new value, they may pass a function to the setValue function. This is a common pattern in React, where the new state depends on the previous state.

Finally, we store the new value in localStorage.

```tsx
function useLocalStorage<InitialValue>(
  key: string,
  initialValue: InitialValue
) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
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
```

</details>

<details>
  <summary>🍿 useWindowSize</summary>

---

The initial values of windowSize should be directly coming from `window` but because we're using SSR first framework, we need to set the initial values to `null` and update them on the first render.

In an SPA application, this wouldn't be necessary.

Whenever the window is resized, we update the windowSize state.

Finally, we remove the event listener on cleanup.

Reminder: Cleanup runs before the "new" effect, it runs with the old values of the effect.

```tsx
function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number | null;
    height: number | null;
  }>({
    width: null,
    height: null,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    // Needed because we're using SSR first framework
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
```

</details>

<details>
  <summary>🍿 usePrevious</summary>

---

# Description

The trick with this hook is to use the `useRef` hook to store the previous value.

The reason we use refs is because they don't cause a re-render when they change, unlike state.

When we first call useRef, this happens before the component renders for the first time, so the ref's current value is `undefined`.

Because useEffect runs after the component renders, the ref's current value will be the previous value.

```tsx
function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

# In depth explanation

## React's Update Cycle

React's update cycle can be simplified into two main phases for our context:

1. **Rendering Phase:** React readies the UI based on the current state and props. This phase concludes with the virtual DOM being refreshed and arranged for applying to the actual DOM. Throughout this phase, your component function operates, executing any hooks invoked within it, such as `useState`, `useRef`, and the setup phase of `useEffect` (where you outline what the effect accomplishes, but it hasn't executed yet).

2. **Commit Phase:** React applies the changes from the virtual DOM to the actual DOM, making those changes visible to the user. This is when the UI is actually updated.

## Execution of `useEffect`

`useEffect` is designed to run _after_ the commit phase. Its purpose is to execute side effects that should not be part of the rendering process, such as fetching data, setting up subscriptions, etc..

## Why Changes in `useEffect` Don't Affect Current Cycle's DOM

- **Timing:** Since `useEffect` runs after the commit phase, the DOM has already been updated with the information from the render phase by the time `useEffect` executes. React does not re-render or update the DOM again immediately after `useEffect` runs within the same cycle because React's rendering cycle has already completed.

- **Intention:** This behavior is by design. React intentionally separates the effects from the rendering phase to ensure that the UI updates are efficient and predictable. If effects could modify the DOM immediately in the same cycle they run, it would lead to potential performance issues and bugs due to unexpected re-renders or state changes after the DOM has been updated.

- **Ref and the DOM:** When you update `ref.current` in `useEffect`, you're modifying a value stored in memory that React uses for keeping references across renders. This update does not trigger a re-render by itself, and because `useEffect`'s changes are applied after the DOM has been updated, **there's no direct mechanism for those changes to modify the DOM until the next render cycle is triggered by state or prop changes.**

</details>

<details>
  <summary>🍿 useIntersectionObserver</summary>

---

`entry` gives us information about the target element's intersection with the root.

The `isIntersecting` property tells us whether the element is visible in the viewport.

As commented in the code, we copy `ref.current` to a variable to avoid a warning from React.

**How it works in a nutshell:** In the useEffect, we create a new IntersectionObserver and observe the target element. We return a cleanup function that unobserves the target element.

```tsx
function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      options
    );

    // Copy ref.current to a variable
    // This is because ref.current may refer to a different element by the time the cleanup function runs
    // This was a warning by React
    // According to this Github issue: https://github.com/facebook/react/issues/15841
    // It's nothing to actually worry about
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options]);

  return [ref, entry] as const;
}
```

</details>

<details>
  <summary>🍿 useNetworkState</summary>

---

This hook is used to monitor the network state of the user.

If you peek into the file `app/routes/use-network-state.tsx`, you'll see we had to author our own type for `navigator.connection` to avoid TypeScript errors.

The main key here is to `navigator`, especially `navigator.connection`.

Now, to be fair, this is an experimental API, as documented on MDN: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection.

How it works in a nutshell: Similar to other hooks that use browser events, we set up event listeners for `online`, `offline`, and `change` events.

`online` -> when browser goes online.
`offline` -> when browser goes offline.
`change` -> when the network state changes.

```tsx
function useNetworkState() {
  const [networkState, setNetworkState] = useState<NetworkState>({
    online: false,
  });

  useEffect(() => {
    const updateNetworkState = () => {
      setNetworkState({
        online: navigator.onLine,
        downlink: navigator.connection?.downlink,
        downlinkMax: navigator.connection?.downlinkMax,
        effectiveType: navigator.connection?.effectiveType,
        rtt: navigator.connection?.rtt,
        saveData: navigator.connection?.saveData,
        type: navigator.connection?.type,
      });
    };

    // Call the function once to get the initial state
    updateNetworkState();

    window.addEventListener("online", updateNetworkState);
    window.addEventListener("offline", updateNetworkState);
    navigator.connection?.addEventListener("change", updateNetworkState);

    return () => {
      window.removeEventListener("online", updateNetworkState);
      window.removeEventListener("offline", updateNetworkState);
      navigator.connection?.removeEventListener("change", updateNetworkState);
    };
  }, []);

  return networkState;
}
```

</details>

<details>
  <summary>🍿 useMediaQuery</summary>

---

We set up a listener for the media query and update the matches state whenever the media query changes.

The matches state is initially set to false, and it is set to true when the media query matches.

We also return a cleanup function that removes the event listener when the component unmounts.

This hook is useful for conditionally rendering content based on the state of a media query.

For example, you can use it to show or hide certain elements based on the screen size.

```tsx
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
```

</details>

<details>
  <summary>🍿 useOrientation</summary>

---

This hook is used to monitor the orientation of the user's device.

For example, you can use it to change the layout of your app based on the orientation of the device.

Orientation means whether the device is in portrait or landscape mode, when e.g. holding your phone, you can hold it vertically or horizontally.

We set up an event listener for the `orientationchange` event and update the orientation state whenever the orientation changes.

```tsx
function useOrientation() {
  const [orientation, setOrientation] = useState<ScreenOrientation | null>(
    null
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.screen.orientation);
    };

    // Set the initial orientation
    handleOrientationChange();

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return orientation;
}
```

</details>

<details>
  <summary>🍿 useSessionStorage</summary>

---

This hook is similar to the `useLocalStorage` hook, but it uses `sessionStorage` instead of `localStorage`.

```tsx
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

  // Set Inital Value
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
```

</details>

<details>
  <summary>🍿 usePreferredLanguage</summary>

---

This hook is used to get the user's preferred language.

It uses the `navigator.language` property to get the user's preferred language.

Every time the user's preferred language changes, the `languagechange` event is fired, and we update the language state.

```tsx
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
```

</details>

<details>
  <summary>🍿 useFetch</summary>

---

This hook is used to fetch data from an API.

It uses the `fetch` API to make a request to the specified URL.

It's gonna fetch the data every time the URL changes.

The `useEffect` hook is used to fetch the data when the URL changes.

It returns an object with the data, loading state, and error.

A common bad practice is to use boolean for the loading state, status is a better approach and more accurate

```tsx
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
```

</details>

<details>
  <summary>🍿 useContinuousRetry</summary>

---

This hook is used to retry a function continuously until it returns true.

The nice part here is that you can specify whatever you want to retry in the callback function.

As commented why we need `useCallback`, it's because we want to retain the same reference across renders, unless its dependencies change.

The callback function would change if e.g. the state inside the callback changes.

Let's look at the route for example:

```tsx
export default function UseContinuousRetryRoute() {
  const [count, setCount] = useState(0);
  const hasResolved = useContinuousRetry(() => count > 10, 1000, {
    maxRetries: 15,
  });

  return (
    // ...
  );
}
```

If `count` changes, the callback function would change, and `attemptRetry` would be re-created as a result.

In the useEffect of the hook, we clean up the interval when the component unmounts.

```tsx
interface UseContinuousRetryOptions {
  interval?: number;
  maxRetries?: number;
}

function useContinuousRetry(
  callback: () => boolean,
  interval: number = 100,
  options: UseContinuousRetryOptions = {}
) {
  const [hasResolved, setHasResolved] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const maxRetries = options.maxRetries;

  // Using useCallback, the function retains the same reference across renders,
  // unless its dependencies change. This stability prevents unnecessary re-executions
  // of effects or callbacks that depend on this function, controlling the retry behavior as expected.
  // Without useCallback, the function would be re-created on every render, even if its dependencies haven't changed.
  const attemptRetry = useCallback(() => {
    if (callback()) {
      setHasResolved(true);
      return;
    }
    setRetryCount((count) => count + 1);
  }, [callback]);

  useEffect(() => {
    const hasRetryReachedLimit =
      maxRetries !== undefined && retryCount >= maxRetries;
    if (hasResolved || hasRetryReachedLimit) {
      return;
    }

    const id = setInterval(attemptRetry, interval);

    return () => clearInterval(id);
  }, [attemptRetry, hasResolved, interval, maxRetries, retryCount]);

  return hasResolved;
}
```

</details>

<details>
  <summary>🍿 useVisibilityChange</summary>

---

This hook is used to monitor the visibility state of the document.

It's useful for when you want to pause or resume a video when the user switches tabs, for example.

The `documentVisible` state is initially set to `null` and it is set to `true` when the document becomes visible.

Because we're using an SSR first framework, we need to set the initial state in the `useEffect` hook.

We also use `document.addEventListener` to listen for the `visibilitychange` event and update the `documentVisible` state accordingly.

Finally, we use `document.removeEventListener` to remove the event listener when the component unmounts.

```tsx
function useVisibilityChange() {
  const [documentVisible, setDocumentVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setDocumentVisible(document.visibilityState === "visible");
    };

    // Set the initial state
    handleVisibilityChange();

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return documentVisible;
}
```

</details>
