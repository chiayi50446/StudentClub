import React, { useState } from 'react';
import './EventForm.css';
import {Navigate} from 'react-router-dom'
const EventForm = ({ event = {}, onSuccess }) => {
    const [title, setTitle] = useState(event.title || '');
    const [date, setDate] = useState(event.date || '');
    const [location, setLocation] = useState(event.location || '');
    const [description, setDescription] = useState(event.description || '');
    const [organizer, setOrganizer] = useState(event.organizer || '');
const[redirect, setRedirect] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const eventData = { title, date, location, description, organizer };

        try {
            if (event._id) {
                await updateEvent(event._id, eventData);
            } else {
                //await createEvent(eventData);
            }
//onSuccess();
setRedirect(true);
        } catch (error) {
            console.error("Error submitting event:", error);
        }
    };
    if (redirect) {
        return <Navigate to='/evnetList'/>
      }

    return (
        <form onSubmit={handleSubmit}>
         <label>Title:</label>   <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event Title" required />
         <label>Date:</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
         <label>Location:</label> <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" required />
         <label>Description:</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
         <label>Organizer:</label> <input type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} placeholder="Organizer" required />
            <button type="submit">{event._id ? 'Update Event' : 'Create Event'}</button>
        </form>
    );
};

export default EventForm;