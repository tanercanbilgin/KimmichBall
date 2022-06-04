require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("./discord");
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
const app = express();
app.use(cors());
app.use(express.json());

const routes = require("./routes/routes");

app.use("/api", routes);
app.use(cors({ origin: "https://html5.haxball.com" }));

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
