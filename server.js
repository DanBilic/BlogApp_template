const express = require("express");
const dotenv = require("dotenv");
const customLogger = require("./middleware/customLogger");
const morgan = require("morgan");

//import Route dateien
const blogs = require("./routes/blogs");

//lade environment variablen
dotenv.config({ path: "./config/config.env" });

const app = express();

//DEVELOPMENT logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.use(customLogger);

//Mount routers
app.use("/api/v1/blogs", blogs);

//default PORT ist 6000
const PORT = process.env.PORT || 6000;

app.listen(
  PORT,
  console.log(
    `Server is running on port ${process.env.PORT} in mode ${process.env.NODE_ENV}`
  )
);
