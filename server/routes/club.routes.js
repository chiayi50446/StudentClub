import express from "express";
import clubController from "../controllers/club.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/api/clubs")
  .get(clubController.list)
  .post(authCtrl.requireSignin, authCtrl.hasAdmin, clubController.create);

router
  .route("/api/clubs/:clubId")
  .get(clubController.read)
  .put(authCtrl.requireSignin, authCtrl.hasClubAdmin, clubController.update)
  .delete(authCtrl.requireSignin, authCtrl.hasClubAdmin, clubController.remove);

router.param("clubId", clubController.clubByID);

export default router;
