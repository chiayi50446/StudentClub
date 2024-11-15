import React, { useState } from 'react';
import { createEvent } from './api-event.js'; // Import the createEvent function
import { TextField, Button, Grid, Typography, Paper } from '@mui/material'; // Material UI components

const EventForm = ({ onEventCreated }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [error, setError] = useState(null); // For error handling

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventData = {
            title,
            date,
            location,
            description,
            organizer,
        };

        console.log("Submitting event data:", eventData); // Debug log

        try {
            const createdEvent = await createEvent(eventData); // Send data to API
            console.log("Created event:", createdEvent); // Debug log

            if (createdEvent) {
                onEventCreated(createdEvent); // Notify parent to update event list
                setTitle('');
                setDate('');
                setLocation('');
                setDescription('');
                setOrganizer('');
                setError(null); // Clear previous errors
            }
        } catch (err) {
            console.error('Error creating event:', err);
            setError('Error creating event. Please try again.'); // Set error message
        }
    };

    return (
        <Paper sx={{ padding: 3, maxWidth: 600, margin: '20px auto' }}>
            <Typography variant="h5" gutterBottom>
                Create Event
            </Typography>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Event Title"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            type="date"
                            label="Event Date"
                            variant="outlined"
                            fullWidth
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Location"
                            variant="outlined"
                            fullWidth
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Organizer"
                            variant="outlined"
                            fullWidth
                            value={organizer}
                            onChange={(e) => setOrganizer(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Create Event
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default EventForm;
