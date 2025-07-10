import { createClient } from "redis";
import pRetry from "p-retry";

const url = process.env.REDIS_URL;
if (!url) throw new Error("REDIS_URL not defined");

export const subscriber = createClient({ 
  url,
  socket: {
    reconnectStrategy: retries => {
      // Retry every 2s for first 5 tries, then give up
      if (retries > 5) return new Error("Redis reconnection failed.");
      return 2000; // ms
    }
  }
});
export const publisher = createClient({ 
  url,
  socket: {
    reconnectStrategy: retries => {
      // Retry every 2s for first 5 tries, then give up
      if (retries > 5) return new Error("Redis reconnection failed.");
      return 2000; // ms
    }
  }
});

(async () => {
  await pRetry(() => subscriber.connect(), {
    retries: 5,
    onFailedAttempt: (error) => {
      console.warn(`Redis subscriber attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`);
    },
  });

  await pRetry(() => publisher.connect(), {
    retries: 5,
    onFailedAttempt: (error) => {
      console.warn(`Redis publisher attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`);
    },
  });
})().catch((err) => {
  console.error('Failed to connect to Redis:', err);
});
