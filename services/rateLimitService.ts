// API rate limiting to prevent excessive Gemini API calls

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitState {
  requests: number[];
  blocked: boolean;
}

class RateLimiter {
  private state: Map<string, RateLimitState> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  // Check if request is allowed
  canMakeRequest(key: string = 'default'): boolean {
    const state = this.getState(key);
    this.cleanOldRequests(state);

    return state.requests.length < this.config.maxRequests;
  }

  // Record a request
  recordRequest(key: string = 'default'): boolean {
    const state = this.getState(key);
    this.cleanOldRequests(state);

    if (state.requests.length >= this.config.maxRequests) {
      state.blocked = true;
      return false;
    }

    state.requests.push(Date.now());
    state.blocked = false;
    return true;
  }

  // Get remaining requests
  getRemainingRequests(key: string = 'default'): number {
    const state = this.getState(key);
    this.cleanOldRequests(state);
    return Math.max(0, this.config.maxRequests - state.requests.length);
  }

  // Get time until reset
  getTimeUntilReset(key: string = 'default'): number {
    const state = this.getState(key);
    if (state.requests.length === 0) return 0;

    const oldestRequest = state.requests[0];
    const resetTime = oldestRequest + this.config.windowMs;
    return Math.max(0, resetTime - Date.now());
  }

  // Check if currently blocked
  isBlocked(key: string = 'default'): boolean {
    const state = this.getState(key);
    this.cleanOldRequests(state);
    return state.requests.length >= this.config.maxRequests;
  }

  private getState(key: string): RateLimitState {
    if (!this.state.has(key)) {
      this.state.set(key, { requests: [], blocked: false });
    }
    return this.state.get(key)!;
  }

  private cleanOldRequests(state: RateLimitState): void {
    const now = Date.now();
    state.requests = state.requests.filter(
      time => now - time < this.config.windowMs
    );
  }

  // Reset rate limiter
  reset(key?: string): void {
    if (key) {
      this.state.delete(key);
    } else {
      this.state.clear();
    }
  }
}

// Default rate limiters for different API types
export const rateLimiters = {
  // Text generation - 30 requests per minute
  text: new RateLimiter({
    maxRequests: 30,
    windowMs: 60 * 1000
  }),

  // Image generation - 10 requests per minute (more expensive)
  image: new RateLimiter({
    maxRequests: 10,
    windowMs: 60 * 1000
  }),

  // General API calls - 60 requests per minute
  general: new RateLimiter({
    maxRequests: 60,
    windowMs: 60 * 1000
  })
};

// Wrapper for rate-limited API calls
export async function withRateLimit<T>(
  limiter: RateLimiter,
  fn: () => Promise<T>,
  key: string = 'default'
): Promise<T> {
  if (!limiter.canMakeRequest(key)) {
    const waitTime = limiter.getTimeUntilReset(key);
    throw new RateLimitError(
      `Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds.`,
      waitTime
    );
  }

  limiter.recordRequest(key);

  try {
    return await fn();
  } catch (error) {
    throw error;
  }
}

// Custom error for rate limiting
export class RateLimitError extends Error {
  public waitTime: number;

  constructor(message: string, waitTime: number) {
    super(message);
    this.name = 'RateLimitError';
    this.waitTime = waitTime;
  }
}

// Helper to format wait time
export function formatWaitTime(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

// Get rate limit status for display
export function getRateLimitStatus(limiter: RateLimiter, key: string = 'default'): {
  remaining: number;
  isBlocked: boolean;
  resetIn: string;
} {
  return {
    remaining: limiter.getRemainingRequests(key),
    isBlocked: limiter.isBlocked(key),
    resetIn: formatWaitTime(limiter.getTimeUntilReset(key))
  };
}

export default rateLimiters;
