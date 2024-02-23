# 50 React Hooks Explained

<details>
  <summary>🍿 useDebounce</summary>

---

This one is pretty straightforward.

Every time value changes, we set a timeout to update the debounced value after the specified delay.

However, if value keeps changing, we clear the timeout and set a new one.

This means if you keep typing for a whole second without stopping, the debounced value will only be updated once at the end.

```tsx
import { useState, useEffect } from "react";

export function useDebounce(value: string, delay: number) {
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
