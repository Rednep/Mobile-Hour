import express from "express";
import session from "express-session";

//Creates an express application instance and defines a port for it to listen on
const app = express();
const port = 8080;

app.use(
  session({
    secret: "super cereal secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

//Enable ejs view engine
app.set("view engine", "ejs");

//Enable support for URL encoded request bodies (form posts)
app.use(express.urlencoded({ extended: true }));

//Linking controller files
import productController from "./controllers/products.js";
app.use(productController);
import orderController from "./controllers/orders.js";
app.use(orderController);
import usersController from "./controllers/users.js";
app.use(usersController);
import changelogController from "./controllers/changelog.js";
app.use(changelogController);

// Redirects requests for root to the products page
app.get("/", (request, response) => {
  response.status(301).redirect("/product_list");
});

//Serve static resources (images, CSS)
app.use(express.static("static"));

//Start the backend express server
app.listen(port, () => {
  console.log("express server started on http://localhost:" + port);
});
