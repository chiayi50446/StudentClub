import express from 'express';
import Event from '../models/event.model.js';

const router = express.Router();

// Route to create a new event
router.post('/api/events', async (req, res) => {
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

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent); // Respond with the created event
    } catch (error) {
        console.error('Error creating event:', error.message);
        res.status(400).json({ error: 'Failed to create event.', details: error.message });
    }
});

// Route to get all events
router.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find()
            .populate('club', 'name') // Fetch the club details
            .sort({ date: 1 }); // Fetch all events sorted by date
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).json({ error: 'Failed to fetch events.', details: error.message });
    }
});

// Route to get a specific event by ID
router.get('/api/events/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id).populate('club', 'name');
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error.message);
        res.status(400).json({ error: 'Failed to fetch event.', details: error.message });
    }
});

// Route to update an event
router.put('/api/events/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validations are applied
        });

        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error.message);
        res.status(400).json({ error: 'Failed to update event.', details: error.message });
    }
});

// Route to delete an event
router.delete('/api/events/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        res.status(200).json({ message: 'Event deleted successfully.', deletedEvent });
    } catch (error) {
        console.error('Error deleting event:', error.message);
        res.status(400).json({ error: 'Failed to delete event.', details: error.message });
    }
});

// Add a rating
router.post('/api/events/rating/:id', async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
  
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
  
    event.ratings.push(rating);
    await event.save();
  
    res.json({ message: 'Rating added', averageRating: event.getAverageRating() });
});

// Get ratings for an event

router.get('/:eventId', async (req, res) => {
    const ratings = await Rating.find({ eventId: req.params.eventId });
    res.json(ratings);
});
export default router;
