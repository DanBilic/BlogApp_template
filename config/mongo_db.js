const mongoose = require("mongoose");

const conncetDB = async () => {
  const connectionToDb = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `Connected to MONGO DB: ${connectionToDb.connection.host}`.cyan.bold
      .underline
  );
};

module.exports = conncetDB;
