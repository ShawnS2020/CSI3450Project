import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mysql from "mysql2";
import bodyParser from "body-parser";
// Import functions from database.js
// These are the functions used for querying
import { getHomes, getHomesSqftDesc, getHomesSqftAsc } from "./database.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __js = dirname(__filename);
const __public = dirname(__js);

app.use(express.static(__public));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// rows is an array holding the queried data. It gets assigned to the results of a SQL query depending on what action was taken on the webpage
// It then gets passed to the html for displaying on the webpage
let rows;

// filter variable is used to determine whether a filter is being applied or not
// It starts off null, meaning it is not being applied
// It can also be assigned "asc" or "desc" depending on whether the user wants the rows to be in ascending or descending order
let sqftFilter = null;

// Initial HTTP GET request upon page load
// It sets rows equal to 'select * from homes' query and renders the webpage with those rows
app.get("/", async (req, res) => {
	// Set rows
	rows = await getHomes();
	// Render web page and pass rows
	res.render(__public + "/index.ejs", { rows : rows });
});

// An HTTP POST request is sent every time a button is clicked
// req.body.btn is used to determine which filter button was clicked
// The corresponding filter variable is used to determine whether it is ascending or descending
app.post("/", async (req, res) => {
	// sqft filter button
	if (req.body.btn == "sqft") {
		if (sqftFilter == null) { // Filter is now applied in descending order
			sqftFilter = "desc";
			rows = await getHomesSqftDesc();
		} else if (sqftFilter == "desc") { // Filter is now applied in ascending order
			sqftFilter = "asc"
			rows = await getHomesSqftAsc();
		} else if (sqftFilter == "asc") { // Filter is removed
			sqftFilter = null;
			rows = await getHomes();
		}
	}

	// Page is rendered and rows gets passed to it
	res.render(__public + "/index.ejs", { rows : rows });
});

app.listen(3000, () => console.log("Server started on port 3000"));