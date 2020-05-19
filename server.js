const express = require("express");
const dotenv = require("dotenv");

//lade environment variablen
dotenv.config({ path: "./config/config.env" });

const app = express();

//default PORT ist 6000
const PORT = process.env.PORT || 6000;

app.listen(
  PORT,
  console.log(
    `Server is running on port ${process.env.PORT} in mode ${process.env.NODE_ENV}`
  )
);
