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
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: {
    type: [Date],
    require: [true, 'Tour must have a start date']
  },
  secretTour: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/ /g, '-');
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query was executed in ${Date.now() - this.start}ms`);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;