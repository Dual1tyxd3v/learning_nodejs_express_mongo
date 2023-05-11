const express = require('express');
const { getTours, createTour, getTour, updateTour, deleteTour, topTours } = require('./../controllers/tourControllers');

const tourRouter = express.Router();
// tourRouter.param('id', checkId);

tourRouter.route('/top-5-tours')
  .get(topTours, getTours);
tourRouter.route('/')
  .get(getTours)
  .post(createTour);
tourRouter.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = tourRouter;