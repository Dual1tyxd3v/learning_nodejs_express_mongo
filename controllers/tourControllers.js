const Tour = require('./../model/tourModel');

exports.topTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,ratingsAverage,price';
  next();
};

exports.getTours = async (req, res) => {
  try {
    const queryObj = {...req.query};
    const excludedFields = ['page', 'limit', 'fields', 'sort'];
    excludedFields.forEach(field => delete queryObj[field]);

    const updQuery = JSON.parse(
      JSON.stringify(queryObj)
      .replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
    );

    let query = Tour.find(updQuery);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy); 
    } else {
      query = query.sort('createdAt');
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields); 
    } else {
      query = query.select('-__v');
    }

    const limit = req.query.limit || 4;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    const toursCount = await Tour.countDocuments();
    if (skip >= toursCount) throw new Error('Page not exist');

    query = query.skip(skip).limit(+limit);

    const tours = await query;

    res.json({
      status: 'success',
      time: req.reqTime,
      counts: tours.length,
      data: {
        tours
      }
    });
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: 'Something goes wrong',
      err: err.message
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: newTour
    });
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid data!'
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(201).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'Tour not found or invalid data'
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id, {
      strict: false
    });
    res.status(204).json({
      status: 'success',
      result: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Something goes wrong'
    });
  }
};