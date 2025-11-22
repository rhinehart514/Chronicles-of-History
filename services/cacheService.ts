// Simple cache service for API responses
// Reduces Gemini API calls and improves performance

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  // Generate cache key from function name and args
  generateKey(prefix: string, ...args: unknown[]): string {
    const argsHash = JSON.stringify(args);
    return `${prefix}:${this.hashString(argsHash)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  // Get from cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // Set in cache
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Clear specific key
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache stats
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Singleton instance
export const cache = new CacheService();

// Decorator-like function to cache async function results
export function withCache<T>(
  fn: (...args: unknown[]) => Promise<T>,
  keyPrefix: string,
  ttl?: number
): (...args: unknown[]) => Promise<T> {
  return async (...args: unknown[]): Promise<T> => {
    const key = cache.generateKey(keyPrefix, ...args);

    // Check cache first
    const cached = cache.get<T>(key);
    if (cached !== null) {
      console.debug(`Cache hit: ${keyPrefix}`);
      return cached;
    }

    // Call function and cache result
    console.debug(`Cache miss: ${keyPrefix}`);
    const result = await fn(...args);
    cache.set(key, result, ttl);

    return result;
  };
}

// TTL constants for different cache types
export const CACHE_TTL = {
  BRIEFING: 10 * 60 * 1000,      // 10 minutes - briefings are unique
  ILLUSTRATION: 30 * 60 * 1000,  // 30 minutes - images don't change
  COUNTRY_DATA: 60 * 60 * 1000,  // 1 hour - static country info
  WORLD_STATE: 5 * 60 * 1000,    // 5 minutes - world state changes
} as const;

export default cache;
