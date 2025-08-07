import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// import postgres from "postgres";

// const sql = postgres(process.env.DATABASE_URL, {
//   ssl: "require", //
// });

export default sql;
