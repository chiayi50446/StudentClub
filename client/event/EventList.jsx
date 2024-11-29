import React, { useState, useEffect } from 'react';
import { listEvents, updateEvent, deleteEvent } from './api-event.js'; // Import API functions
import { list } from '../club/api-club.js'; // Import clubs function
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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const EventList = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [clubs, setClubs] = useState([]); // State for clubs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null); // Event being edited
    const [updatedEvent, setUpdatedEvent] = useState({}); // Updated event data
    const [filter, setFilter] = useState({
        title: '',
        club: '',
        location: '',
        date: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsData, clubsData] = await Promise.all([
                    listEvents(),
                    list()
                ]);
                setEvents(eventsData);
                setClubs(clubsData);
                setFilteredEvents(eventsData); // Initialize filtered events
            } catch (err) {
                setError('Error loading events or clubs');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const applyFilter = () => {
            let filtered = events;

            if (filter.title) {
                filtered = filtered.filter(event =>
                    event.title.toLowerCase().includes(filter.title.toLowerCase())
                );
            }

            if (filter.club) {
                filtered = filtered.filter(event => event.club && event.club._id === filter.club);
            }

            if (filter.location) {
                filtered = filtered.filter(event =>
                    event.location.toLowerCase().includes(filter.location.toLowerCase())
                );
            }

            if (filter.date) {
                // Format the date input for comparison (YYYY-MM-DD)
                const filterDate = new Date(filter.date).toISOString().split('T')[0];

                filtered = filtered.filter(event => {
                    const eventDate = event.date.split('T')[0]; // Extract the date part from the ISO string (YYYY-MM-DD)
                    return eventDate === filterDate;
                });
            }

            setFilteredEvents(filtered);
        };

        applyFilter(); // Apply the filter whenever the filter state changes
    }, [filter, events]);

    const handleEditClick = (event) => {
        setEditingEvent(event);
        setUpdatedEvent({ 
            ...event, 
            club: event.club?._id || '',
            date: event.date.split('T')[0] || '', // Format date to YYYY-MM-DD for the dialog input
            organizer: event.organizer || ''
        }); // Pre-fill the dialog with existing data
    };

    const handleAddClick = () => {
        navigate("/eventForm");
    };

    const handleRateEvent = () => {
        navigate("/eventRating");
    };

    const handleCloseDialog = () => {
        setEditingEvent(null);
    };

    const handleUpdateEvent = async () => {
        try {
            // Ensure the date is correctly formatted before sending the update request
            const formattedDate = updatedEvent.date + 'T00:00:00Z'; // Append time to make it a full ISO string (midnight)
            await updateEvent(editingEvent._id, { ...updatedEvent, date: formattedDate });
            
            // After updating, refetch the events to refresh the list
            const updatedEvents = await listEvents();
            setEvents(updatedEvents);
            setFilteredEvents(updatedEvents); // Also update filtered events
            handleCloseDialog();
        } catch (err) {
            alert('Failed to update event');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await deleteEvent(eventId);
            const updatedEvents = await listEvents();
            setEvents(updatedEvents);
            setFilteredEvents(updatedEvents); // Update the filtered events list
        } catch (err) {
            alert('Failed to delete event');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prevFilter) => ({
            ...prevFilter,
            [name]: value
        }));
    };

    const handleClubChange = (e) => {
        const selectedClubId = e.target.value;
        const selectedClub = clubs.find(club => club._id === selectedClubId);
        setUpdatedEvent({
            ...updatedEvent,
            club: selectedClub
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedEvent({
            ...updatedEvent,
            [name]: value
        });
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

            {/* Filter Section */}
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                <TextField
                    label="Search by Title"
                    name="title"
                    value={filter.title}
                    onChange={handleFilterChange}
                    fullWidth
                />
                <TextField
                    select
                    label="Filter by Club"
                    name="club"
                    value={filter.club}
                    onChange={handleFilterChange}
                    fullWidth
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {clubs.map((club) => (
                        <MenuItem key={club._id} value={club._id}>
                            {club.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Search by Location"
                    name="location"
                    value={filter.location}
                    onChange={handleFilterChange}
                    fullWidth
                />
                <TextField
                    label="Search by Date"
                    type="date"
                    name="date"
                    value={filter.date}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
            </Box>

            {filteredEvents.length === 0 ? (
                <Typography variant="body1">No events found.</Typography>
            ) : (
                <List>
                    {filteredEvents.map((event) => (
                        <React.Fragment key={event._id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={event.title}
                                    secondary={
                                        <>
                                            {event.date && <Typography component="span" variant="body2" color="textSecondary">
                                                Date: {(() => {
                                                    const eventDate = new Date(event.date);
                                                    // Add one day to the event date
                                                    eventDate.setDate(eventDate.getDate());
                                                    // Format the date as YYYY-MM-DD
                                                    const formattedDate = eventDate.toISOString().split('T')[0];
                                                    return `${formattedDate} | Location: ${event.location}`;
                                                })()}
                                                <br />
                                            </Typography>}
                                            <Typography component="span" variant="body2" color="textSecondary">
                                                Organizer: {event.organizer}<br/>
                                            </Typography>
                                            {event.description && (
                                                <Typography component="span" variant="body2" color="textSecondary">
                                                    Description: {event.description}<br/>
                                                </Typography>
                                            )}
                                            {event.club && (
                                                <Typography component="span" variant="body2" color="textSecondary">
                                                    Club: {event.club.name}
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
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            )}

            <Dialog open={Boolean(editingEvent)} onClose={handleCloseDialog}>
                <DialogTitle>Edit Event</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        name="title"
                        fullWidth
                        value={updatedEvent.title || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        name="date"
                        type="date"
                        fullWidth
                        value={updatedEvent.date || ''}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        name="location"
                        fullWidth
                        value={updatedEvent.location || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        fullWidth
                        value={updatedEvent.description || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Organizer"
                        name="organizer"
                        fullWidth
                        value={updatedEvent.organizer || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Club"
                        name="club"
                        fullWidth
                        value={updatedEvent.club || ''}
                        onChange={handleClubChange}
                    >
                        {clubs.map((club) => (
                            <MenuItem key={club._id} value={club._id}>
                                {club.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateEvent} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EventList;
