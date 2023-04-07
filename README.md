Instructions on running this web application:

This project requires Node.js and MySQL to run

After installing MySQL and logging in, copy and paste the contents of mysqlscript.txt into MySQL to create the database, tables, and rows.
Next, open the .env file found in the project's root directory and add your MySQL password to it.
You may also need to change the username in the .env file if you are not logged in as the default root user in MySQL.
Move the .env file into public/js/

After installing Node, you can use npm commands to install the necessary dependencies.
From your command line, navigate to the project's root folder and run the command "npm i"
Once these dependencies are finished installing, navigate to public/js/ and run the command "node server.js"
If everything was done correctly, you should see the respnes "Server started on port 3000"

Now open any web browser and type "localhost:3000" into the address bar to see the application running

The application uses a SELECT query to load all the tables into the page.
Use the "+" and "-" buttons to INSERT and DELETE rows from the tables.
You can also edit any content in the tables and click the "update all" button to UPDATE a table.
Click the "Owner" link in the top right to see the OWNER table. You can perform the same actions here as well.
There is a folder called demo containing some images displaying the INSERT and UPDATE functionality.

database.js contains the method from the driver that connects to the MySQL database.
It also contains functions for all the queries used.
These queries are exported to server.js where they are called depending on which buttons are pressed.
server.js is also responsible for loading and redirecting webpages.
body-parser is a middleware technology that allows the developer to access incoming request bodies from the web page.
This is how we check which button is pressed in the app.post method in server.js
