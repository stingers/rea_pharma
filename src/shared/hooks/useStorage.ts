import { useEffect, useState } from "react";

export function useStorage<T>(key: string, initialValue: T | (() => T), local: boolean = false) {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = !local ? sessionStorage.getItem(key) : localStorage.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);

    if (typeof initialValue === "function") {
      return (initialValue as () => T)();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue];
}
