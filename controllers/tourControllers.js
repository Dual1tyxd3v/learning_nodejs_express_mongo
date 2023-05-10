const Tour = require('./../model/tourModel');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Wrong data to create Tour'
    });
  }
  next();
};

exports.getTours = (req, res) => {
  res.json({
    status: 'success',
    time: req.reqTime,
    /* data: {
      tours: toursSimple
    } */
  });
};

exports.createTour = (req, res) => {
  
};

exports.getTour = (req, res) => {
  
};

exports.updateTour = (req, res) => {
  
};

exports.deleteTour = (req, res) => {
  
};