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
  database: process.env.MYSQL_DATABASE,
  dateStrings: true
}).promise();



// Below are the functions for querying data
// These functions get exported to server.js and the server sends data to the HTML webpage
// NOTE: the pool.query method returns an array of TWO arrays. The first array is the query results, the second array is just metadata.
// So make sure to grab only the 0th element of pool.query

// Select queries for the main table on the page will always join all columns from home with owner.name and sale.price
async function getHomes() {
	const rows = (await pool.query("select home.*, owner.name, sale.price from home left join owner on home.owner_ssn = owner.ssn left join sale on sale.home_id = home.home_id;"))[0];
	return rows;
}

async function getSales() {
	const sales = (await pool.query("select * from sale order by home_id asc;"))[0];
	return sales;
}

// Insert functions
// Inserts a new row with default values (all null)
async function insertHome() {
	await pool.query("insert into home values ();");
}

async function insertSale() {
	await pool.query("insert into sale values ();");
}

// Update functions update all rows in that table
async function updateHome(id, type, sqft, floors, bedrooms, bathrooms, landSize, year) {
	for (let i = 0; i < id.length; i ++) {
		// If any values are an empty string, assign them as null so rows aren't updated with empty strings
		if (type[i] == "") { type[i] = null; } else { type[i] = "'"+type[i]+"'"; }
		if (sqft[i] == "") { sqft[i] = null; }
		if (floors[i] == "") { floors[i] = null; }
		if (bedrooms[i] == "") { bedrooms[i] = null; }
		if (bathrooms[i] == "") { bathrooms[i] = null; }
		if (landSize[i] == "") { landSize[i] = null; }
		if (year[i] == "") { year[i] = null; }

		await pool.query("update home set type="+type[i]+", sqft="+sqft[i]+", floors="+floors[i]+", bedrooms="+bedrooms[i]+", bathrooms="+bathrooms[i]+", land_size="+landSize[i]+", year="+year[i]+" where home_id="+id[i]+";");
	}
}

async function updateSale(saleId, homeId, price, dateListed, dateSold) {
	for (let i = 0; i < saleId.length; i ++) {
		// If any values are an empty string, assign them as null so rows aren't updated with empty strings
		if (homeId[i] == "") { homeId[i] = null; }
		if (price[i] == "") { price[i] = null; }
		if (dateListed[i] == "") { dateListed[i] = null; } else { dateListed[i] = "'"+dateListed[i]+"'"; }
		if (dateSold[i] == "") { dateSold[i] = null; } else { dateSold[i] = "'"+dateSold[i]+"'"; }

		await pool.query("update sale set home_id="+homeId[i]+", price="+price[i]+", date_listed="+dateListed[i]+", date_sold="+dateSold[i]+" where sale_id="+saleId[i]+";");
	}
}

// Deletes a row
// Also sets home_id = null on any child sales
async function deleteHome(id) {
	await pool.query("set foreign_key_checks = 0;");
	await pool.query("delete from home where home_id = " + id + ";");
	await pool.query("delete from sale where home_id = " + id + ";");
	await pool.query("set foreign_key_checks = 1;");
}

async function deleteSale(id) {
	await pool.query("delete from sale where sale_id = " + id + ";");
}

// Selects and orders rows by owner.name ascending
async function getHomesOwnerAsc() {
	const rows = (await pool.query("select home.*, owner.name, sale.price from home left join owner on home.owner_ssn = owner.ssn left join sale on sale.home_id = home.home_id order by owner.name asc;"))[0];
	return rows;
}

// Selects and orders rows by owner.name descending
async function getHomesOwnerDesc() {
	const rows = (await pool.query("select home.*, owner.name, sale.price from home left join owner on home.owner_ssn = owner.ssn left join sale on sale.home_id = home.home_id order by owner.name desc;"))[0];
	return rows;
}

// Selects and orders rows by home.sqft ascending
async function getHomesSqftAsc() {
	const rows = (await pool.query("select home.*, owner.name, sale.price from home left join owner on home.owner_ssn = owner.ssn left join sale on sale.home_id = home.home_id order by sqft asc;"))[0];
	return rows;
}

// Selects and orders rows by home.sqft descending
async function getHomesSqftDesc() {
	const rows = (await pool.query("select home.*, owner.name, sale.price from home left join owner on home.owner_ssn = owner.ssn left join sale on sale.home_id = home.home_id order by sqft desc;"))[0];
	return rows;
}

// Export to server.js
export { getHomes, getSales, insertHome, insertSale, updateHome, updateSale, deleteHome, deleteSale, getHomesOwnerAsc, getHomesOwnerDesc, getHomesSqftAsc, getHomesSqftDesc };
