const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../model/tourModel');

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DATABASE, {
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => console.log('DB connection successful'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Delete is done!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importData = async () => {
try {
  await Tour.create(tours);
  console.log('Collection was filled');
} catch(err) {
  console.log(err);
}
process.exit();
};

if (process.argv[2] === '--delete') {
  deleteData();
} else if (process.argv[2] === '--import') {
  importData();
}
