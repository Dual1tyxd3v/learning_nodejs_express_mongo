const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE, {
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => console.log('DB connection successful'));

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

const app = require('./app');

app.listen(process.env.PORT, () => {
  console.log('Server ready');
});