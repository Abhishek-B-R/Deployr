import { createClient } from "redis"

export const subscriber=createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
})
subscriber.connect()

export const publisher=createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
})
publisher.connect()