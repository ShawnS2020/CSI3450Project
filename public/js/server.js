import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mysql from "mysql2";
import bodyParser from "body-parser";
// Import functions from database.js
// These are the functions used for querying
import { getHomes, insert, update, deleteHome, getHomesOwnerAsc, getHomesOwnerDesc, getHomesSqftAsc, getHomesSqftDesc, getHomesBathroomsAsc, getHomesBathroomsDesc } from "./database.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __js = dirname(__filename);
const __public = dirname(__js);

app.use(express.static(__public));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// rows is an array holding the queried data. It gets assigned to the results of a SQL query depending on what action was taken on the webpage
// It then gets passed to the html for displaying on the webpage
// Here, it is assigned to getHomes(), as this is the initial data displayed on the page
let rows = await getHomes();

// filter variable is used to determine whether a filter is being applied or not
// It starts off null, meaning it is not being applied
// It can also be assigned "asc" or "desc" depending on whether the user wants the rows to be in ascending or descending order
let sqftFilter = null;
let ownerFilter = null;
let bathroomsFilter = null;

// Initial HTTP GET request upon page load
app.get("/", async (req, res) => {
	// Render web page and pass rows
	res.render(__public + "/index.ejs", { rows : rows });
});

// An HTTP POST request is sent every time a button is clicked
// req.body.btn is used to determine which filter button was clicked
// The corresponding filter variable is used to determine whether it is ascending or descending
app.post("/", async (req, res) => {

	// + button (inserts a home with default values)
	if (req.body.btn == "+") {
		await insert();
		rows = await getHomes();
	}

	// update button (updates all rows)
	if (req.body.btn == "update") {
		await update(req.body.id, req.body.type, req.body.sqft, req.body.floors, req.body.bedrooms, req.body.bathrooms, req.body.land_size, req.body.year);
		rows = await getHomes();
	}

	// - button (deletes the corresponding home)
	if (Number(req.body.btn) > 0) {
		await deleteHome(req.body.btn);
		rows = await getHomes();
	}

	// owner filter button
	if (req.body.btn == "owner") {
		if (ownerFilter == null || ownerFilter == "desc") { // Filter is now applied in ascending order
			ownerFilter = "asc";
			rows = await getHomesOwnerAsc();
		} else if (ownerFilter == "asc") { // Filter is now applied in descending order
			ownerFilter = "desc"
			rows = await getHomesOwnerDesc();
		}
	}

	// sqft filter button
	if (req.body.btn == "sqft") {
		if (sqftFilter == null || sqftFilter == "desc") { // Filter is now applied in ascending order
			sqftFilter = "asc";
			rows = await getHomesSqftAsc();
		} else if (sqftFilter == "asc") { // Filter is now applied in descending order
			sqftFilter = "desc"
			rows = await getHomesSqftDesc();
		}
	}

	// bathrooms filter button
	if (req.body.btn == "bathrooms") {
		if (bathroomsFilter == null || bathroomsFilter == "desc") { // Filter is now applied in ascending order
			bathroomsFilter = "asc";
			rows = await getHomesBathroomsAsc();
		} else if (bathroomsFilter == "asc") { // Filter is now applied in descending order
			bathroomsFilter = "desc"
			rows = await getHomesBathroomsDesc();
		}
	}

	// X button (removes filters)
	if (req.body.btn == "x") {
		ownerFilter = null;
		sqftFilter = null;
		bathroomsFilter = null;
		rows = await getHomes();
	}

	// Page is reloaded with updated rows
	res.redirect("/");
});

app.listen(3000, () => console.log("Server started on port 3000"));
