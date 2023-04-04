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

// Select queries will always join all columns from home with owner.name and sale.price as this is the information we want to display on the page
// Selects all from home joined with owner.name and sale.price
async function getHomes() {
	const rows = (await pool.query("select home.*, owner.name, sale.price from home left join owner on home.owner_ssn = owner.ssn left join sale on sale.home_id = home.home_id;"))[0];
	return rows;
}

// Inserts a new row into home with default values (all null)
async function insert() {
	await pool.query("insert into home values ();");
}

// Updates all rows
async function update(id, type, sqft, floors, bedrooms, bathrooms, landSize, year, price, name) {
	// console.log(id, type, sqft, floors, price, name);
	for (let i = 0; i < type.length; i ++) {
		if (type[i] == "") { type[i] = null; } else { type[i] = "'"+type[i]+"'"; }
		if (sqft[i] == "") { sqft[i] = null; }
		if (floors[i] == "") { floors[i] = null; }
		if (bedrooms[i] == "") { bedrooms[i] = null; }
		if (bathrooms[i] == "") { bathrooms[i] = null; }
		if (landSize[i] == "") { landSize[i] = null; }
		if (year[i] == "") { year[i] = null; }
		if (price[i] == "") { price[i] = null; }
		if (name[i] == "") { name[i] = null } else { name[i] = "'"+name[i]+"'"; }
		console.log(id[i], type[i], sqft[i], floors[i], bedrooms[i], bathrooms[i], landSize[i], year[i], price[i], name[i]);
		await pool.query("update home set type="+type[i]+", sqft="+sqft[i]+", floors="+floors[i]+", bedrooms="+bedrooms[i]+", bathrooms="+bathrooms[i]+", land_size="+landSize[i]+", year="+year[i]+" where home_id="+id[i]+";");
		await pool.query("update sale set price="+price[i]+" where home_id="+id[i]+";");
		await pool.query("update owner, home set owner.name="+name[i]+" where home.home_id="+id[i]+" and home.owner_ssn = owner.ssn;");
	}
}

// Deletes a row
// Also sets home_id = null on any child sales
async function deleteHome(id) {
	await pool.query("set foreign_key_checks = 0;");
	await pool.query("delete from home where home_id = " + id + ";");
	await pool.query("update sale set home_id = null where home_id = " + id + ";");
	await pool.query("set foreign_key_checks = 1;");
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
export { getHomes, insert, update, deleteHome, getHomesOwnerAsc, getHomesOwnerDesc, getHomesSqftAsc, getHomesSqftDesc };
