const db = require("./Helpers/Database/database");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Person = require("./Models/TestModel");
const commonRoutes = require("./Routes/CommonRoutes");
const adminRoutes = require("./Routes/AdminRoutes");
const categoryRoutes = require("./Routes/CategoryRoutes");
var app = express();

// Apply middlewares
const allowedOrigins = ["http://localhost:8000", "http://localhost:3000", "https://localhost:8000", "https://localhost:3000"];
app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// Default route
app.get("/", function (req, res) {
  res.end("Bluelbis server is now running.");
});

app.use("/api/", commonRoutes);
app.use("/api/admin/", adminRoutes);
app.use("/api/category/", categoryRoutes);

//Run application
app.listen("5354", () => {
  console.log("Application is running on port no. 5354");
});
