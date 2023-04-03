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
// NOTE: the pool.query method returns an array of TWO arrays. The first array is the query results, the second array is just metadata.
// So make sure to grab only the 0th element of pool.query

// Selects all from home except home_id joined with owner.name and sale.price
async function getHomes() {
	const rows = (await pool.query("select home.*, owner.name, sale.price from home left join owner on home.owner_ssn = owner.ssn left join sale on sale.home_id = home.home_id;"))[0];
	return rows;
}

// Inserts a new row into home with default values (all null)
async function insert() {
	await pool.query("insert into home values ();");
}

// Deletes a row
// Also sets home_id = null on any child sales
async function deleteHome(id) {
	await pool.query("set foreign_key_checks = 0;");
	await pool.query("delete from home where home_id = " + id + ";");
	await pool.query("update sale set home_id = null where home_id = " + id + ";");
	await pool.query("set foreign_key_checks = 1;");
}

// Selects all from home except home_id joined with owner.name and sale.price ordered by sqft desc
async function getHomesSqftDesc() {
	const rows = (await pool.query("select home.*, owner.name, sale.price from home left join owner on home.owner_ssn = owner.ssn left join sale on sale.home_id = home.home_id order by sqft desc;"))[0];
	return rows;
}

// Selects all from home except home_id joined with owner.name and sale.price ordered by sqft asc
async function getHomesSqftAsc() {
	const rows = (await pool.query("select home.*, owner.name, sale.price from home left join owner on home.owner_ssn = owner.ssn left join sale on sale.home_id = home.home_id order by sqft asc;"))[0];
	return rows;
}

// Export to server.js
export { getHomes, insert, deleteHome, getHomesSqftDesc, getHomesSqftAsc };
