// Client-side content cache
const contentCache = new Map<string, string>()

export function getContentCache(key: string): string | undefined {
  return contentCache.get(key)
}

export function setContentCache(key: string, value: string): void {
  contentCache.set(key, value)
}

export function clearContentCache(): void {
  contentCache.clear()
}

export function removeFromContentCache(key: string): void {
  contentCache.delete(key)
}

// Initialize cache with site config defaults
export function initializeContentCache(initialContent: Record<string, string | undefined>) {
  Object.entries(initialContent).forEach(([key, value]) => {
    if (value !== undefined) {
      setContentCache(key, value)
    }
  })
}