const Tour = require('./../model/tourModel');
const APIFeatures = require('./../utils/APIFeatures');

exports.topTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,ratingsAverage,price';
  next();
};

exports.getTours = async (req, res) => {
  try {
    const ApiGetTours = new APIFeatures(Tour.find(), req.query).filter().sort().fields().limit();

    const tours = await ApiGetTours.query;

    res.json({
      status: 'success',
      time: req.reqTime,
      counts: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: `Invalid data!\n${err}`
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
  } catch (err) {
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
  } catch (err) {
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

exports.tourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gt: 4.6 } }
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
    ]);
    res.status(200).json({
      status: 'success',
      stats
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Something goes wrong'
    });
  }
};

exports.monthlyPlan = async (req, res) => {
  try {
    const year = req.params.year;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          num: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: { _id: 0 }
      },
      {
        $sort: { num: -1}
      }
    ]);
    res.status(200).json({
      status: 'success',
      plan
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Something goes wrong'
    });
  }
};
