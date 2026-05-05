import dotenv from "dotenv";
import express from "express";
import pg from "pg";

dotenv.config();
const app = express();

// ── database connection ──
const pool = new pg.Pool({
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port:     5432,
  ssl:      { rejectUnauthorized: false }
});

// test the connection on startup
pool.connect((err, client, release) => {
	if (err) {
		console.error('Failed to connect to database:', err);
	} else {
		console.log('Connected to PostgreSQL database');
		release();
	}
});

app.get("/", (request, response) => {
	response.send("Server is ready");
});

app.listen(3000, () => {
	console.log("Server started at http://localhost:3000");
});