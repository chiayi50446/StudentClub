import React, { useState, useEffect } from "react";
import { updateEvent } from "./api-event.js"; // Import API functions
import { readEvent } from "./api-event.js"; // Import API functions
import { useParams } from "react-router-dom";
import { read as readClub } from "../club/api-club.js";
import Container from "@mui/material/Container";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function Event() {
  const [event, setEvent] = useState(null);
  const [club, setClub] = useState(null);
  const [rating, setRating] = useState(0);
  const { eventId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    readEvent(eventId, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
        setEvent(null); // Set club to null if there's an error
        setError("Failed to load event. Please try again later.");
      } else {
        setEvent(data); // Update the club state with the fetched data
      }
    });

    return function cleanup() {
      abortController.abort(); // Cleanup on unmount
    };
  }, [eventId]);

  useEffect(() => {
    if (event && event.club) {
      const abortController = new AbortController();
      const signal = abortController.signal;

      readClub({ clubId: event.club._id }, signal).then((data) => {
        if (data && data.error) {
          console.log(data.error);
          setClub(null); // Set club to null if there's an error
          setError("Failed to load users. Please try again later.");
        } else {
          console.log(data);
          setClub(data); // Update the club state with the fetched data
        }
      });

      return function cleanup() {
        abortController.abort();
      };
    }
  }, [event]);

  const handleRating = () => {
    if (!event.rating) {
      event.rating = [];
    }
    event.rating.push({ stars: rating });
    try {
      const updated = updateEvent(eventId, event);
      //   setEvents((prevEvents) =>
      //     prevEvents.map((event) =>
      //       event._id === editingEvent._id ? updated : event
      //     )
      //   );
    } catch (err) {
      console.log(err);
    }
    alert("Rating submitted!");
  };

  return (
    <>
      <Container maxWidth="lg">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Organizer</th>
              <th>Club</th>
            </tr>
          </thead>
          <tbody>
            {event && (
              <tr>
                <td>{event.title}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>{event.organizer}</td>
                <td>{club && club.name}</td>
                {/* <td>
                <button onClick={() => onEdit(event)}>Edit</button>
                <button onClick={() => onDelete(event._id)}>Delete</button>
              </td> */}
              </tr>
            )}
          </tbody>
        </table>
        <div>
          <h3>Rate this Event</h3>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
          />
          <button onClick={handleRating}>Submit</button>
        </div>
        <div>
          <h3>Rates</h3>
          {event &&
            event.rating &&
            event.rating.length > 0 &&
            event.rating.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={"Stars:" + item.stars} />
              </ListItem>
            ))}
          <span></span>
        </div>
      </Container>
    </>
  );
}
