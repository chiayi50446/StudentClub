import React, {useState} from 'react';

const EventList = ({  }) => {
    const[event, setevent] = useState({});
    const onDelete = async(e)=>{}
        const onEdit = async(e)=>{}


   const events = [{
        _id: " 5694045544",
        title: "Event1",
        date:Date.now,
        location: " Toronto",
        organizer : "School"
    }]

    return (
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
)
};

export default EventList;
