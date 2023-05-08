const express = require('express');
const { getTours, createTour, getTour, updateTour, deleteTour, checkId } = require('./../controllers/tourControllers');

const tourRouter = express.Router();
tourRouter.param('id', checkId);

tourRouter.route('/')
  .get(getTours)
  .post(createTour);
tourRouter.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = tourRouter;