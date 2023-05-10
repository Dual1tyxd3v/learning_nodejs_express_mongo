const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE, {
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => console.log('DB connection successful'));

const app = require('./app');

app.listen(process.env.PORT, () => {
  console.log('Server ready');
});