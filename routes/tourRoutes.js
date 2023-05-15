const express = require('express');
const { getTours, createTour, getTour, updateTour, deleteTour, topTours, tourStats } = require('./../controllers/tourControllers');

const tourRouter = express.Router();
// tourRouter.param('id', checkId);

tourRouter.route('/top-5-tours')
  .get(topTours, getTours);
tourRouter.route('/tour-stats')
  .get(tourStats);
tourRouter.route('/')
  .get(getTours)
  .post(createTour);
tourRouter.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = tourRouter;