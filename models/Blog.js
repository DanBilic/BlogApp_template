const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");

const BlogSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxLength: [40, "name can not be any longer than 40 characters"],
    },
    //URL firendly Version of the name
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create blog slug from the name - Mongoose Middleware
//normal function so this references the right Blog Instance
BlogSchema.pre("save", function (next) {
  // console.log("Slugify Middleware runs", this.name);
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Cascade delete when blog gets removed
BlogSchema.pre("remove", async function (next) {
  console.log(`Posts being removed from blog ${this._id}`);
  await this.model("Post").deleteMany({ blog: this._id });
  next();
});

//Reverse populate with virtuals
BlogSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "blog",
  justOne: false,
});

module.exports = mongoose.model("Blog", BlogSchema);
