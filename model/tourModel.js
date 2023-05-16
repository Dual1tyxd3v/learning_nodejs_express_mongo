const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Tour must have a name'],
    trim: true,
    maxlength: [40, 'Tour name must have less or equal 40 characters'],
    minlength: [4, 'Tour name must have more or equal 4 characters']
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price']
  },
  discountPrice: {
    type: Number,
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) must below of regular price'
    } 
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    max: [5, 'Rating must be less then 5'],
    min: [0, 'Rating must be greater then 0']
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
    required: [true, 'Tour must have a difficulty'],
    enum: {
      values: ['easy', 'difficult', 'medium'],
      message: 'Invalid difficulty'
    }
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

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;