import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// Pool connects to the MySQL database using environment variables
// You should create a .env file in the same folder as this file to assign each environment variable
// .env file should just be four lines for each variable like below example
// process.env.MYSQL_HOST="localhost"
// process.env.MYSQL_DATABAE="realestate"
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();



// Below are the functions for querying data
// These functions get exported to server.js and the server sends data to the HTML webpage

// select * from home
async function getHomes() {
	const rows = (await pool.query("select * from home"))[0];
	return rows;
}

// select * from home order by sqft desc
async function getHomesSqftDesc() {
	const rows = (await pool.query("select * from home order by sqft desc"))[0];
	return rows;
}

// select * from home order by sqft asc
async function getHomesSqftAsc() {
	const rows = (await pool.query("select * from home order by sqft asc"))[0];
	return rows;
}

// Export to server.js
export { getHomes, getHomesSqftDesc, getHomesSqftAsc };
