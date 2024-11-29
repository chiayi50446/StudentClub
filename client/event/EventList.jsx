import React, { useState, useEffect } from 'react';
import { listEvents, updateEvent, deleteEvent } from './api-event.js'; // Import API functions
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';


const EventList = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null); // Event being edited
    const [updatedEvent, setUpdatedEvent] = useState({}); // Updated event data
    


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await listEvents(); // Fetch the events from the API
                setEvents(data);
            } catch (err) {
                setError('Error loading events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Handle edit dialog opening
    const handleEditClick = (event) => {
        setEditingEvent(event);
        setUpdatedEvent(event); // Pre-fill the dialog with existing data
    };

    const handleAddClick = () => {
        navigate("/eventForm")
    }

    const handleRateEvent = () => {
        navigate("/eventRating")

    }


    // Handle edit dialog closing
    const handleCloseDialog = () => {
        setEditingEvent(null);
    };

    // Handle update event submission
    const handleUpdateEvent = async () => {
        try {
            const updated = await updateEvent(editingEvent._id, updatedEvent);
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event._id === editingEvent._id ? updated : event
                )
            );
            handleCloseDialog();
        } catch (err) {
            alert('Failed to update event');
        }
    };

    
   
    // Handle delete event
    const handleDeleteEvent = async (eventId) => {
        try {
            await deleteEvent(eventId);
            setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
        } catch (err) {
            alert('Failed to delete event');
        }
    };

    if (loading) {
        return (
            <Paper sx={{ p: 2, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body1">Loading events...</Typography>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Paper>
        );
    }

    


    // const calculateAverageRating = (ratings) => {
    //     if (ratings.length === 0) return 0;
    //     const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    //     return (totalRating / ratings.length).toFixed(1);
    //   };
    
    //   return (
    //     <div>
    //       {events.map(event => (
    //         <div key={event._id}>
    //           <h3>{event.name}</h3>
    //           <p>{event.description}</p>
    //           <p>Date: {new Date(event.date).toLocaleDateString()}</p>
    //           <p>Average Rating: {calculateAverageRating(event.ratings)} / 5</p>
    //           <EventRating eventId={event._id} />
    //         </div>
    //       ))}
    //     </div>
    //   );

    return (

        <Box sx={{ maxWidth: 600, margin: 'auto', p: 2 }}>
            <ListItem alignItems="flex-start">
                <ListItemText>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Event Management
                    </Typography>
                </ListItemText>
            <Button
                variant="contained"
                size="small"
                sx={{ mt: 1 }}
                startIcon={<AddIcon />}
                onClick={() => handleAddClick()}
            >
                Add
            </Button>
            </ListItem>
            {events === null || events.length===0 ? (
                <Typography variant="body1">No events found.</Typography>
            ) : (
                <List>
                    {events.map((event) => (
                        <React.Fragment key={event._id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={event.title}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="textSecondary">
                                                {new Date(event.date).toLocaleDateString()} | {event.location}<br/>
                                            </Typography>
                                            <Typography component="span" variant="body2" color="textSecondary">
                                                Organizer: {event.organizer}<br/>
                                            </Typography>
                                            {event.description && (
                                                <Typography component="span" variant="body2" color="textSecondary">
                                                    {event.description}
                                                </Typography>
                                            )}
                                          
                                          {event.rating && event.rating.map((item, i) => {
                                                <Typography component="span" variant="body2" color="textSecondary">
                                                    {event.description}
                                                </Typography>
                                            })}

                                        </>
                                    }
                                />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ mx: 1 }}
                                    onClick={() => handleEditClick(event)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleDeleteEvent(event._id)}
                                >
                                    Delete
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleRateEvent(event)}
                                >
                                   Rate
                                </Button>
            
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    ))}
                </List>
            )}

            {/* Edit Event Dialog */}
            <Dialog open={Boolean(editingEvent)} onClose={handleCloseDialog}>
                <DialogTitle>Edit Event</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={updatedEvent.title || ''}
                        onChange={(e) =>
                            setUpdatedEvent({ ...updatedEvent, title: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={updatedEvent.date?.split('T')[0] || ''}
                        onChange={(e) =>
                            setUpdatedEvent({ ...updatedEvent, date: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        fullWidth
                        value={updatedEvent.location || ''}
                        onChange={(e) =>
                            setUpdatedEvent({ ...updatedEvent, location: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={updatedEvent.description || ''}
                        onChange={(e) =>
                            setUpdatedEvent({ ...updatedEvent, description: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Organizer"
                        fullWidth
                        value={updatedEvent.organizer || ''}
                        onChange={(e) =>
                            setUpdatedEvent({ ...updatedEvent, organizer: e.target.value })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateEvent} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};



export default EventList;
