import React, { useState, useEffect } from "react";
import { listEvents, updateEvent, deleteEvent } from "./api-event.js"; // Import API functions
import { list as listClub } from "../club/api-club.js"; // Import clubs function
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import auth from "../lib/auth-helper.js";

const EventList = () => {
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setRating(0);
    setComment('');
    setExpanded(newExpanded ? panel : false);
  };
  const navigate = useNavigate();
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [clubs, setClubs] = useState([]); // State for clubs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null); // Event being edited
  const [updatedEvent, setUpdatedEvent] = useState({}); // Updated event data
  const [filter, setFilter] = useState({
    title: "",
    club: "",
    location: "",
    date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, clubsData] = await Promise.all([
          listEvents(),
          listClub(),
        ]);
        setEvents(eventsData);
        setClubs(clubsData);
        setFilteredEvents(eventsData); // Initialize filtered events
      } catch (err) {
        setError("Error loading events or clubs");
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
        filtered = filtered.filter((event) =>
          event.title.toLowerCase().includes(filter.title.toLowerCase())
        );
      }

      if (filter.club) {
        filtered = filtered.filter(
          (event) => event.club && event.club._id === filter.club
        );
      }

      if (filter.location) {
        filtered = filtered.filter((event) =>
          event.location.toLowerCase().includes(filter.location.toLowerCase())
        );
      }

      if (filter.date) {
        // Format the date input for comparison (YYYY-MM-DD)
        const filterDate = new Date(filter.date).toISOString().split("T")[0];

        filtered = filtered.filter((event) => {
          const eventDate = event.date.split("T")[0]; // Extract the date part from the ISO string (YYYY-MM-DD)
          return eventDate === filterDate;
        });
      }

      setFilteredEvents(filtered);
    };

    applyFilter(); // Apply the filter whenever the filter state changes
  }, [filter, events]);

  const handleEditClick = (e, event) => {
    e.stopPropagation();
    setEditingEvent(event);
    setUpdatedEvent({
      ...event,
      date: event.date.split("T")[0] || "", // Format date to YYYY-MM-DD for the dialog input
      organizer: event.organizer || "",
    }); // Pre-fill the dialog with existing data
  };

  const handleAddClick = () => {
    navigate("/eventForm");
  };

  const handleRateEvent = (event) => {
    navigate("/event/" + event._id);
  };

  const handleCloseDialog = () => {
    setEditingEvent(null);
  };

  const handleRating = async(event) => {
    setRating(0);
    setComment('');
    if (!event.rating) {
      event.rating = [];
    }
    event.rating.push({ userId: auth.isAuthenticated().user._id, userName:auth.isAuthenticated().user.name, stars: rating, comment: comment });
    try {
      const updated = await updateEvent(event._id, event);
      setEvents((prevItems) =>{
        return prevItems.map((item) =>
          item._id === event._id  ? updated : item
        )}
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getAverage = (array) => {
    console.log(array);
    return array.reduce((sum, currentValue) => sum + currentValue.stars, 0) / array.length;
  };

  const handleUpdateEvent = async () => {
    try {
      // Ensure the date is correctly formatted before sending the update request
      const formattedDate = updatedEvent.date + "T00:00:00Z"; // Append time to make it a full ISO string (midnight)
      await updateEvent(editingEvent._id, {
        ...updatedEvent,
        date: formattedDate,
      });

      // After updating, refetch the events to refresh the list
      setEvents((prevItems) =>{
        return prevItems.map((item) =>
          item._id === updatedEvent._id  ? updatedEvent : item
        )}
      );
      handleCloseDialog();
    } catch (err) {
      alert("Failed to update event");
    }
  };

  const handleDeleteEvent = async (e, eventId) => {
    e.stopPropagation();
    try {
      await deleteEvent(eventId);
      setEvents((prevItems) =>{
        return prevItems.filter((item) =>
          item._id !== eventId
        )}
      );
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const handleClearFilterChange = (name) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: '',
    }));
  };

  const handleClubChange = (e) => {
    const {club} = updatedEvent;
    club._id = e.target.value,
    club.name = clubs.find(x => x._id === e.target.value).name
    setUpdatedEvent({
      ...updatedEvent,
      club: club
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent({
      ...updatedEvent,
      [name]: value,
    });
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1">Loading events...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Paper>
    );
  }
  const DateAvatar = ({ date }) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
    });
  
    const [month, day] = formattedDate.split(' ');
  
    return (
      <Avatar
        sx={{
          width: 40,
          height: 40,
          backgroundColor: '#1976d2',
          color: 'white',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 0,
          mt:1
        }}
      >
        <Typography variant="caption" sx={{ fontSize: 12 }}>
          {month.toUpperCase()}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
          {day}
        </Typography>
      </Avatar>
    );
  };
  

  return (
    <Container maxWidth="lg">
      <ListItem alignItems="flex-start">
        <ListItemText>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Event Management
          </Typography>
        </ListItemText>
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          startIcon={<AddIcon />}
          onClick={() => handleAddClick()}
        >
          Add
        </Button>
      </ListItem>
      {/* Filter Section */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Search by Title"
          name="title"
            size="small"
          value={filter.title}
          onChange={handleFilterChange}
          fullWidth
        />
        <TextField
          select
          label="Filter by Club"
          name="club"
          size="small"
          value={filter.club}
          onChange={handleFilterChange}
          fullWidth
        >
          {clubs.map((club) => (
            <MenuItem key={club._id} value={club._id}>
              {club.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Search by Location"
          name="location"
            size="small"
          value={filter.location}
          onChange={handleFilterChange}
          fullWidth
        />
        <TextField
          label="Search by Date"
          type="date"
          name="date"
            size="small"
          value={filter.date}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Box>
      <div>
          <Stack direction="row" sx={{ mb: 1 }}>
            {filter.title && (
              <Chip
                size="small"
                name="title"
                label={filter.title}
                variant="outlined"
                onClick={() => handleClearFilterChange("title")}
                onDelete={() => handleClearFilterChange("title")}
              />
            )}
            {filter.club && (
              <Chip
                size="small"
                label={clubs.find((member) => member._id === filter.club).name}
                name="club"
                variant="outlined"
                onClick={() => handleClearFilterChange("club")}
                onDelete={() => handleClearFilterChange("club")}
              />
            )}
            {filter.location && (
              <Chip
                size="small"
                name="location"
                label={filter.location}
                variant="outlined"
                onClick={() => handleClearFilterChange("location")}
                onDelete={() => handleClearFilterChange("location")}
              />
            )}
            {filter.date && (
              <Chip
                size="small"
                name="date"
                label={filter.date}
                variant="outlined"
                onClick={() => handleClearFilterChange("date")}
                onDelete={() => handleClearFilterChange("date")}
              />
            )}
          </Stack>
        </div>
        {filteredEvents.map((event, index) => (
          <Accordion key={index} expanded={expanded === index} onChange={handleChange(index)}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
            <ListItem alignItems="flex-start"
            secondaryAction={
              <>
                {/* <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleRateEvent(event)}
                >
                  Detail
                </Button> */}
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mx: 1 }}
                  onClick={(e) => handleEditClick(e, event)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={(e) => handleDeleteEvent(e, event._id)}
                >
                  Delete
                </Button>
                </>
            }>
              <ListItemAvatar>
                <DateAvatar date={event.date} />
              </ListItemAvatar>
                <ListItemText
                  primary={
                  <Grid container>
                    <Grid>
                      <Typography variant="h5">
                        {event.title}
                      </Typography>
                    </Grid>
                    <Grid>
                      <Rating value={getAverage(event.rating) ?? 0} precision={0.1} readOnly size="small" sx={{mt: 1, ml: 1}}/>
                    </Grid>
                    <Grid>
                      <Typography variant="h6" sx={{fontSize: '0.75rem', pt:1}}>
                      {`(${event.rating.length})`}
                      </Typography>
                    </Grid>
                  </Grid>
                  }
                  secondary={
                      <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                        >
                          By: {event.club?.name} / Location: {event.location}
                          <br />
                      </Typography>
                  }
                />
            </ListItem>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6">
            {event.description}
            </Typography>
            <Typography variant="caption">
              Organizer: {event.organizer}
            </Typography>
            {auth.isAuthenticated() && <Paper sx={{m: 1, p:1}}>
                <ListItem
                  disableGutters
                  secondaryAction={
                    <IconButton aria-label="send" color="primary" onClick={()=>{handleRating(event)}}>
                      <SendIcon  />
                    </IconButton>
                  }
                >
                  <Rating 
                    name="controlled-rating" 
                    value={rating} 
                    precision={1} 
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}/>
                </ListItem>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Comment"
                  multiline
                  maxRows={4}
                  fullWidth
                  placeholder="Leave your comment here"
                  value={comment}
                  onChange={(event) => {setComment(event.target.value)}}
                />
            </Paper>}
            {event.rating && event.rating.length>0 && event.rating.map((item, i) => {
              return (
                  <div key={i}>
                    <Divider sx={{mt:1, mb:1}}/>
                    <Typography variant="subtitle1">
                      {item.userName}
                    </Typography>
                    <Rating name="half-rating-read" value={item.stars} precision={1} readOnly size="small" sx={{mt: 1}}/>
                    {item.comment && <Typography variant="body2">
                      {item.comment}
                    </Typography>}
                  </div>
              )})}
          </AccordionDetails>
        </Accordion>
        ))}
     
    <Box sx={{ maxWidth: 600, margin: "auto", p: 2 }}>
      <Dialog open={Boolean(editingEvent)} onClose={handleCloseDialog}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={updatedEvent.title || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Date"
            name="date"
            type="date"
            fullWidth
            value={updatedEvent.date || ""}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Location"
            name="location"
            fullWidth
            value={updatedEvent.location || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            value={updatedEvent.description || ""}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Organizer"
            name="organizer"
            fullWidth
            value={updatedEvent.organizer || ""}
            onChange={handleInputChange}
          />
          <TextField
            select
            margin="dense"
            label="Club"
            name="club"
            fullWidth
            value={updatedEvent.club?._id}
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
    
    </Container>
  );
};

export default EventList;
