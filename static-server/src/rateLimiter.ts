const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

const LIMIT = 10;
export const INTERVAL = 60 * 1000; // 1 minute

/**
 * Returns true if the IP is over the limit and should be blocked.
 */
export const checkRateLimit = (ip: string): boolean => {
  const currentTime = Date.now();
  const resetTime = currentTime + INTERVAL;

  if (rateLimitMap.has(ip)) {
    const entry = rateLimitMap.get(ip)!;
    const { count, expiresAt } = entry;

    if (currentTime > expiresAt) {
      rateLimitMap.set(ip, { count: 1, expiresAt: resetTime });
      return false;
    }

    if (count < LIMIT) {
      rateLimitMap.set(ip, { count: count + 1, expiresAt: resetTime });
      return false;
    }

    return true;
  }

  rateLimitMap.set(ip, { count: 1, expiresAt: resetTime });
  return false;
};

/**
 * Returns retry-after seconds when limited; 0 when not limited.
 */
export const getRetryAfterSeconds = (ip: string): number => {
  const currentTime = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) return 0;
  const { count, expiresAt } = entry;
  if (currentTime > expiresAt || count < LIMIT) return 0;
  return Math.max(1, Math.ceil((expiresAt - currentTime) / 1000));
};
