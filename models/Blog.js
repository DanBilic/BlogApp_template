const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxLength: [40, "name can not be any longer than 40 characters"],
  },
  //URL firendly Version of the name -> Der Titel wird zu der-titel
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxLenght: [1000, "Description can not be more than 1000 characters"],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
  },
  blogType: {
    type: [String],
    required: true,
    enum: ["Web Development", "Finance", "Nature", "Food"],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating can not be more than 5"],
  },
  picture: {
    type: String,
    default: "no-photo.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", BlogSchema);
