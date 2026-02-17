import { useState, useEffect } from 'react'

/**
 * Custom hook for localStorage with type safety
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Remove item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}

/**
 * Hook to monitor localStorage quota
 */
export const useLocalStorageQuota = () => {
  const [usage, setUsage] = useState(0)
  const [quota] = useState(5) // Approximate 5MB limit

  useEffect(() => {
    const calculateUsage = () => {
      let total = 0
      for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
          total += localStorage[key].length + key.length
        }
      }
      setUsage(total / (1024 * 1024)) // Convert to MB
    }

    calculateUsage()

    // Update every 5 seconds
    const interval = setInterval(calculateUsage, 5000)
    return () => clearInterval(interval)
  }, [])

  return {
    usage,
    quota,
    percentage: (usage / quota) * 100,
    isNearLimit: usage / quota > 0.8,
  }
}
