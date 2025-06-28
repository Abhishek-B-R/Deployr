import { Pool } from "pg"
import { DATABASE_URL } from "./envVars"

const pgClient = new Pool({
    connectionString: DATABASE_URL
});

export default pgClient;