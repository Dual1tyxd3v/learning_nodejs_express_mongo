const fs = require('fs');

const toursSimple = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getTours = (req, res) => {
  res.json({
    status: 'success',
    time: req.reqTime,
    data: {
      tours: toursSimple
    }
  });
};

exports.createTour = (req, res) => {
  const newId = toursSimple[toursSimple.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  toursSimple.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(toursSimple), err => {
    if (err) res.status(404).send('File cannot be written');
    res.status(201).json({
      status: 'succes',
      data: {
        tour: newTour
      }
    });
  });
};

exports.getTour = (req, res) => {
  const tour = toursSimple.find(tourItem => tourItem.id === +req.params.id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }
  res.json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.updateTour = (req, res) => {
  const tour = toursSimple.find(tourItem => tourItem.id === +req.params.id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }
  res.json({
    status: 'success',
    message: `${tour.name} is updated`
  });
};

exports.deleteTour = (req, res) => {
  const tour = toursSimple.find(tourItem => tourItem.id === +req.params.id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found'
    });
  }
  res.status(204).json({
    status: 'success',
    message: null
  });
};