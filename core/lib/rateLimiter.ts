const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

/** Max requests per IP per interval (e.g. 20 requests per minute). */
export const LIMIT = 10;
export const INTERVAL = 60 * 1000; // 1 minute

/**
 * Returns true if the IP is over the limit and should be blocked.
 */
export const checkRateLimit = (ip: string): boolean => {
  const currentTime = Date.now();
  const resetTime = currentTime + INTERVAL;

  if (rateLimitMap.has(ip)) {
    const { count, expiresAt } = rateLimitMap.get(ip)!;

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

export type RateLimitStatus =
  | { limited: false }
  | { limited: true; retryAfterSeconds: number };

/**
 * Use when the IP is already known to be limited (e.g. in middleware) to get retry-after for the UI.
 */
export const getRateLimitStatus = (ip: string): RateLimitStatus => {
  const currentTime = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) return { limited: false };
  const { count, expiresAt } = entry;
  if (currentTime > expiresAt) return { limited: false };
  if (count >= LIMIT) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((expiresAt - currentTime) / 1000),
    );
    return { limited: true, retryAfterSeconds };
  }
  return { limited: false };
};

/**
 * Get client IP from request headers (works in Edge middleware).
 */
export const getClientIp = (req: Request): string => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
};
