import React, { useState } from 'react';
import { updateEvent } from './api-event.js'; // Import API functions

const EventRating = ({ eventId }) => {
  const [rating, setRating] = useState(0);

  const handleRating = () => {


    try {
      const updated = updateEvent(editingEvent._id, updatedEvent);
      setEvents((prevEvents) =>
          prevEvents.map((event) =>
              event._id === editingEvent._id ? updated : event
          )
      );
      handleCloseDialog();
  } catch (err) {
      alert('Failed to update event');
  }
    // rateEvent(eventId, rating).then(() => alert('Rating submitted!'));
}; 

return (
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
  );
};



export default EventRating;
