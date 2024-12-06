import express from "express";
import eventController from "../controllers/event.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/api/events")
  .get(eventController.list)
  .post(authCtrl.requireSignin, eventController.create);

router
  .route("/api/events/:id")
  .get(eventController.read)
  .put(authCtrl.requireSignin, eventController.update)
  .delete(authCtrl.requireSignin, eventController.remove);

router.param("id", eventController.eventByID);

export default router;
