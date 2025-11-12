export const getStorageItem = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return defaultValue ?? null
    return JSON.parse(item)
  } catch {
    return defaultValue ?? null
  }
}

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error(`Failed to set storage item: ${key}`)
  }
}

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch {
    console.error(`Failed to remove storage item: ${key}`)
  }
}

export const clearStorage = (): void => {
  try {
    localStorage.clear()
  } catch {
    console.error('Failed to clear storage')
  }
}
