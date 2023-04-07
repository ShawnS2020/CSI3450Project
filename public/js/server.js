import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mysql from "mysql2";
import bodyParser from "body-parser";
// Import functions from database.js
// These are the functions used for querying
import { getHomes, getSales, getOwners, insertHome, insertSale, insertOwner, updateHome, updateSale, updateOwner, deleteHome, deleteSale, deleteOwner, getHomesBathroomsAsc, getHomesBathroomsDesc, getHomesOwnerAsc, getHomesOwnerDesc, getHomesSqftAsc, getHomesSqftDesc } from "./database.js";

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
let sales = await getSales();
let owners = await getOwners();

// filter variable is used to determine whether a filter is being applied or not
// It starts off null, meaning it is not being applied
// It can also be assigned "asc" or "desc" depending on whether the user wants the rows to be in ascending or descending order
let sqftFilter = null;
let ownerFilter = null;
let bathroomsFilter = null;

// Initial HTTP GET request upon page load
app.get("/", async (req, res) => {
	// Render web page and pass rows
	res.render(__public + "/index.ejs", { data : { rows:rows, sales:sales, owners:owners } });
});

app.get("/owner", async (req, res) => {
	// let owners = await getOwners();
	// Render web page and pass rows
	res.render(__public + "/owner.ejs", { owners : owners });
});

// An HTTP POST request is sent every time a button is clicked
// req.body.btn is used to determine which filter button was clicked
// The corresponding filter variable is used to determine whether it is ascending or descending
app.post("/", async (req, res) => {
	
	const btn = JSON.parse(req.body.btn);

	if (btn.table == "home") {

		// + button (inserts a home with default values)
		if (btn.action == "+") {
			await insertHome();
			rows = await getHomes();
		}

		// update button (updates all rows)
		if (btn.action == "update") {
			await updateHome(req.body.id, req.body.type, req.body.sqft, req.body.floors, req.body.bedrooms, req.body.bathrooms, req.body.land_size, req.body.year);
			rows = await getHomes();
		}

		// - button (deletes the corresponding home)
		if (btn.action == "-") {
			await deleteHome(btn.id);
			rows = await getHomes();
		}

		// bathrooms filter button
		if (btn.action == "bathrooms") {
			if (bathroomsFilter == null || bathroomsFilter == "desc") { // Filter is now applied in ascending order
				bathroomsFilter = "asc";
				rows = await getHomesBathroomsAsc();
			} else if (bathroomsFilter == "asc") { // Filter is now applied in descending order
				bathroomsFilter = "desc"
				rows = await getHomesBathroomsDesc();
			}
		}

		// owner filter button
		if (btn.action == "owner") {
			if (ownerFilter == null || ownerFilter == "desc") { // Filter is now applied in ascending order
				ownerFilter = "asc";
				rows = await getHomesOwnerAsc();
			} else if (ownerFilter == "asc") { // Filter is now applied in descending order
				ownerFilter = "desc"
				rows = await getHomesOwnerDesc();
			}
		}

		// sqft filter button
		if (btn.action == "sqft") {
			if (sqftFilter == null || sqftFilter == "desc") { // Filter is now applied in ascending order
				sqftFilter = "asc";
				rows = await getHomesSqftAsc();
			} else if (sqftFilter == "asc") { // Filter is now applied in descending order
				sqftFilter = "desc"
				rows = await getHomesSqftDesc();
			}
		}

		// X button (removes filters)
		if (btn.action == "x") {
			ownerFilter = null;
			sqftFilter = null;
			bathroomsFilter = null;
			rows = await getHomes();
		}

	} else if (btn.table == "sale") {
		
		console.log(req.body);
		if (btn.action == "+") {
			await insertSale();
			sales = await getSales();
		}

		if (btn.action == "update") {
			try {
				await updateSale(req.body.sale_id, req.body.home_id, req.body.sale_price, req.body.date_listed, req.body.date_sold);
			} catch (error) {
				console.log(error);
			}
			rows = await getHomes();
			sales = await getSales();
		}

		if (btn.action == "-") {
			await deleteSale(btn.id);
			sales = await getSales();
		}

	} 

	// Page is reloaded with updated rows
	res.redirect("/");
});

app.post("/owner", async (req, res) => {

	const btn = JSON.parse(req.body.btn);

	if (btn.action == "+") {
		await insertOwner();
		owners = await getOwners();
	}

	if (btn.action == "-") {
		console.log(btn.id);
		await deleteOwner(btn.id);
		owners = await getOwners();
	}

	if (btn.action == "update") {
		console.log(req.body);
		try {
			await updateOwner(req.body.oldssn, req.body.newssn, req.body.name, req.body.dependents, req.body.income, req.body.age, req.body.profession);
		} catch (error) {
			console.log(error);
		}
		rows = await getHomes();
		sales = await getSales();
		owners = await getOwners();
	}

	res.redirect("/owner");
});

app.listen(3000, () => console.log("Server started on port 3000"));
