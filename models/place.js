const mongoose = require("mongoose");
const Review = require("./review");

const placeSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  images: [{
    url: String,
    filename: String
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

placeSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
