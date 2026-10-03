import { drizzle } from 'drizzle-orm/neon-http';

const db = drizzle(process.env.DATABASE_URL!);

export {db }; // export the db instance for use in other parts of the application
