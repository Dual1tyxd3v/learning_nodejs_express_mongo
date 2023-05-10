const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Tour must have a name']
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price']
  },
  rating: {
    type: Number,
    default: 4
  }
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;