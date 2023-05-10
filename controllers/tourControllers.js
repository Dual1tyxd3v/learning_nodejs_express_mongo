const Tour = require('./../model/tourModel');

exports.getTours = (req, res) => {
  res.json({
    status: 'success',
    time: req.reqTime,
    /* data: {
      tours: toursSimple
    } */
  });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: newTour
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data!'
    });
  }
};

exports.getTour = (req, res) => {
  
};

exports.updateTour = (req, res) => {
  
};

exports.deleteTour = (req, res) => {
  
};