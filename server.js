const express = require("express");
const dotenv = require("dotenv");
const customLogger = require("./middleware/customLogger");
const morgan = require("morgan");
const connectDB = require("./config/mongo_db");
const colors = require("colors");
const errorHandler = require("./middleware/error");

//lade environment variablen
dotenv.config({ path: "./config/config.env" });

//Connect to mongo DB
connectDB();

//import Route dateien
const blogs = require("./routes/blogs");

const app = express();

//Body parser
app.use(express.json());

//DEVELOPMENT logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.use(customLogger);

//Mount routers
app.use("/api/v1/blogs", blogs);

// Middleware für die Fehlerbehandlung wird ganz zuletzt nach allen anderen app.use()- und Weiterleitungsaufrufen definiert.
app.use(errorHandler);

//default PORT ist 6000
const PORT = process.env.PORT || 6000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running on `.yellow.bold,
    `PORT: ${process.env.PORT}`.magenta.bold,
    ` in mode `.yellow.bold,
    `${process.env.NODE_ENV}`.magenta.bold
  )
);

//  handle promise rejections taht are not catched
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);

  //  close server and terminate process
  //  process.exit(1) -> terminate process with failure
  server.close(() => process.exit(1));
});
