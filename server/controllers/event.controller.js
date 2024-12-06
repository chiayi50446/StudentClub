import Event from '../models/event.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';

const create = async (req, res) => {
    const { title, date, location, description, organizer, club } = req.body;

    try {
        const newEvent = new Event({
            title,
            date,
            location,
            description,
            organizer,
            club,
        });
        await newEvent.validate();
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent); // Respond with the created event
    } catch (error) {
        console.error('Error creating event:', error.message);
        res.status(400).json({ error: 'Failed to create event.', details: error.message });
    }
};

const list = async (req, res) => {
    try {
        let events = await Event.find()
            .populate('club', 'name') // Populate the club name from the Club collection
            .sort({ date: 1 }); // Fetch all events sorted by date
        res.json(events);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const eventByID = async (req, res, next, id) => {
    try {
        let event = await Event.findById(id).populate('club', 'name');
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        req.event = event; // Use descriptive name
        next();
    } catch (err) {
        console.error('Error fetching event:', error.message);
        res.status(400).json({ error: 'Failed to fetch event.', details: error.message });
    }
};

const read = (req, res) => {
    if (!req.event) {
        return res.status(404).json({ error: "Event not found" });
    }
    return res.json(req.event);
};

const update = async (req, res) => {
    const allowedUpdates = ['title', 'date', 'location', 'description', 'organizer', 'club', 'rating'];
    try {
        let event = req.event;
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        const updates = Object.keys(req.body);
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
