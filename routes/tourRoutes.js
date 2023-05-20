const express = require('express');
const { getTours, createTour, getTour, updateTour, deleteTour, topTours, tourStats, monthlyPlan } = require('./../controllers/tourControllers');
const { protect } = require('../controllers/userControllers');

const tourRouter = express.Router();
// tourRouter.param('id', checkId);

tourRouter.route('/top-5-tours')
  .get(topTours, getTours);
tourRouter.route('/tour-stats')
  .get(tourStats);
tourRouter.route('/monthly-plan/:year')
  .get(monthlyPlan);
tourRouter.route('/')
  .get(protect, getTours)
  .post(createTour);
tourRouter.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = tourRouter;