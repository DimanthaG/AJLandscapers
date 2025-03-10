// Client-side content cache
const contentCache = new Map<string, string>()

export function setContentCache(key: string, content: string) {
  contentCache.set(key, content)
}

export function getContentCache(key: string) {
  return contentCache.get(key)
}

export function clearContentCache() {
  contentCache.clear()
}

// Initialize cache with site config defaults
export function initializeContentCache(initialContent: Record<string, string | undefined>) {
  Object.entries(initialContent).forEach(([key, value]) => {
    if (value !== undefined) {
      setContentCache(key, value)
    }
  })
}