import express from "express";
import eventController from "../controllers/event.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import Event from "../models/event.model.js";

const router = express.Router();

router
  .route("/api/events")
  .get(eventController.list)
  .post(authCtrl.requireSignin, authCtrl.hasAdmin, eventController.create);

router
  .route("/api/events/:id")
  .get(eventController.read)
  .put(authCtrl.requireSignin, eventController.update)
  .delete(authCtrl.requireSignin, eventController.remove);

router.route("/api/events/rating/:id").post(eventController.rateEvent);

router.param("id", eventController.eventByID);

export default router;
