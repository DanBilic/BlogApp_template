const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please add a title for the review"],
  },
  description: {
    type: String,
    required: [true, "Please add a description for the review"],
  },
  rating: {
    type: Number,
    required: [true, "Please add a rating"],
    min: 1,
    max: 5,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  blog: {
    type: mongoose.Schema.ObjectId,
    ref: "Blog",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// every user can only make one review per blog
ReviewSchema.index({ blog: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
