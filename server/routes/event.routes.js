import express from 'express';
import eventController from "../controllers/event.controller.js";
import Event from '../models/event.model.js';

const router = express.Router();

router
    .route("/api/events")
    .get(eventController.list)
    .post(eventController.create);

router
    .route("/api/events/:id")
    .get(eventController.read)
    .put(eventController.update)
    .delete(eventController.remove);

router
    .route("/api/events/rating/:id")
    .post(eventController.rateEvent);

router.param("id", eventController.eventByID);

export default router;
