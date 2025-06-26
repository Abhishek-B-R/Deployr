
import { createClient } from "redis"

export const subscriber=createClient()
subscriber.connect()

export const publisher=createClient()
publisher.connect()