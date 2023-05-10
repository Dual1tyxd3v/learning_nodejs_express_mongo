const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Tour must have a name'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price']
  },
  ratingsAverage: {
    type: Number,
    default: 0
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    required: [true, 'Tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    default: 1
  },
  difficulty: {
    type: String,
    required: [true, 'Tour must have a difficulty']
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Tour must have a short description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'Tour must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: {
    type: [Date],
    require: [true, 'Tour must have a start date']
  }
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;