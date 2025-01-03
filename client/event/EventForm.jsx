import React, { useState, useEffect } from "react";
import { createEvent } from "./api-event.js";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { list } from "../club/api-club.js";
import auth from "../lib/auth-helper.js";

const EventForm = () => {
  const locationState = useLocation().state;
  const [lockClub, setLockClub] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [club, setClub] = useState("");
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState(null);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    if (locationState && locationState.clubId !== "") {
      setLockClub(true);
      setClub(locationState.clubId);
    }
    const fetchClubs = async () => {
      try {
        const fetchedClubs = await list();
        setClubs(fetchedClubs);
      } catch (err) {
        console.error("Error fetching clubs:", err);
      }
    };

    fetchClubs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      title,
      date,
      location,
      description,
      organizer,
      club,
    };

    try {
      const createdEvent = await createEvent(eventData, { t: jwt.token });

      if (createdEvent) {
        setTitle("");
        setDate("");
        setLocation("");
        setDescription("");
        setOrganizer("");
        setClub("");
        setError(null);
        navigate("/eventList");
      }
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Error creating event. Please try again.");
    }
  };

  return (
    <Paper sx={{ padding: 3, maxWidth: 600, margin: "20px auto" }}>
      <Typography variant="h5" gutterBottom>
        Create Event
      </Typography>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
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
            <FormControl fullWidth required disabled={lockClub}>
              <InputLabel>Club</InputLabel>
              <Select
                value={club}
                onChange={(e) => setClub(e.target.value)}
                label="Club"
              >
                {clubs.length > 0 ? (
                  clubs.map((club) => (
                    <MenuItem key={club._id} value={club._id}>
                      {club.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">Loading clubs...</MenuItem>
                )}
              </Select>
            </FormControl>
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
