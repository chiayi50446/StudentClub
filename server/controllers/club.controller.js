import Club from "../models/club.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";

const create = async (req, res) => {
  const club = new Club(req.body);
  try {
    await club.save();
    res.json(club);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const list = async (req, res) => {
  try {
    const { clubList } = req.query;
    const query = {};
    if (clubList) {
      query._id = { $in: req.query.clubList.split(",") };
    }

    let clubs = await Club.find(query).select(
      "name description status type leadership pictureUri contactInfo created updated"
    );
    res.json(clubs);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const clubByID = async (req, res, next, id) => {
  try {
    let club = await Club.findById(id);
    if (!club)
      return res.status("400").json({
        error: "Club not found",
      });
    req.profile = club;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve club",
    });
  }
};
const read = (req, res) => {
  return res.json(req.profile);
};
const update = async (req, res) => {
  try {
    let club = req.profile;
    club = extend(club, req.body);
    club.updated = Date.now();
    await club.save();
    res.json(club);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
const remove = async (req, res) => {
  try {
    let club = req.profile;
    let deletedClub = await club.deleteOne();
    res.json(deletedClub);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const hasClubAdmin = (req, res, next) => {
  const authorized =
    req.profile &&
    req.auth &&
    (req.profile.leadership.some((x) => x.leadershipId == req.auth._id) ||
      req.auth.isAdmin);
  if (!authorized) {
    return res.status("403").json({
      error: "User is not club admin",
    });
  }
  next();
};
export default { create, clubByID, read, list, remove, update, hasClubAdmin };
