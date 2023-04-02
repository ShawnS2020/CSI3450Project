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

// selects all from home except home_id joined with owner.name and sale.price
async function getHomes() {
	const rows = (await pool.query("select home.sqft, home.floors, home.bedrooms, home.bathrooms, home.land_size, home.year, home.type, owner.name, sale.price from home left join owner on home.owner_ssn = owner.ssn left join sale on sale.home_id = home.home_id;"))[0];
	return rows;
}

// selects all from home except home_id joined with owner.name and sale.price ordered by sqft desc
async function getHomesSqftDesc() {
	const rows = (await pool.query("select home.sqft, home.floors, home.bedrooms, home.bathrooms, home.land_size, home.year, home.type, owner.name, sale.price from home left join owner on home.owner_ssn = owner.ssn left join sale on sale.home_id = home.home_id order by sqft desc;"))[0];
	return rows;
}

// selects all from home except home_id joined with owner.name and sale.price ordered by sqft asc
async function getHomesSqftAsc() {
	const rows = (await pool.query("select home.sqft, home.floors, home.bedrooms, home.bathrooms, home.land_size, home.year, home.type, owner.name, sale.price from home left join owner on home.owner_ssn = owner.ssn left join sale on sale.home_id = home.home_id order by sqft asc;"))[0];
	return rows;
}

// Export to server.js
export { getHomes, getHomesSqftDesc, getHomesSqftAsc };
