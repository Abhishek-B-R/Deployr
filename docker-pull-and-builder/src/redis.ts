import { createClient } from "redis"

export const subscriber=createClient({
    url: "redis://redis:6379",
})
subscriber.connect()

export const publisher=createClient({
    url: "redis://redis:6379",
})
publisher.connect()