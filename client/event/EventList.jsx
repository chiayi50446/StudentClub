import React from 'react';

const EventList = ({ events, onDelete, onEdit }) => (
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Organizer</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {events && events.map((event) => (
                <tr key={event._id}>
                    <td>{event.title}</td>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td>{event.location}</td>
                    <td>{event.organizer}</td>
                    <td>
                        <button onClick={() => onEdit(event)}>Edit</button>
                        <button onClick={() => onDelete(event._id)}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default EventList;
