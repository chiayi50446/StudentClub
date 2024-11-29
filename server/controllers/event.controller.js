import Event from '../models/event.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';

const create = async (req, res) => {
    console.log(req.body);
    const event = new Event(req.body);

    try {
        await event.validate(); // Explicitly validate input
        await event.save();
        return res.status(200).json({
            message: "Successfully created event!"
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err) || err.message
        });
    }
};

const list = async (req, res) => {
    try {
        let events = await Event.find().select('title date location organizer description created updated');
        res.json(events);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const eventByID = async (req, res, next, id) => {
    try {
        let event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        req.event = event; // Use descriptive name
        next();
    } catch (err) {
        return res.status(400).json({ error: "Could not retrieve event" });
    }
};

const read = (req, res) => {
    if (!req.event) {
        return res.status(404).json({ error: "Event not found" });
    }
    return res.json(req.event);
};

const update = async (req, res) => {
    const allowedUpdates = ['title', 'date', 'location', 'description', 'organizer'];
    try {
        let event = req.event;
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const updates = Object.keys(req.body);
        const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

        if (!isValidUpdate) {
            return res.status(400).json({ error: "Invalid updates" });
        }

        updates.forEach(update => (event[update] = req.body[update]));
        event.updated = Date.now();
        await event.save();

        res.json(event);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const remove = async (req, res) => {
    try {
        let event = req.event;
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        let deletedEvent = await event.deleteOne();
        res.json(deletedEvent);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

// Rate an event
const rateEvent = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
  
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
  
    event.ratings.push(rating);
    await event.save();
  
    res.json({ message: 'Rating added', averageRating: event.getAverageRating() });
  };



export default { create, list, eventByID, read, update, remove, rateEvent };
