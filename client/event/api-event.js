// Helper function to handle API requests
const apiRequest = async (url, method, eventData = null) => {
    try {
        const options = {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: eventData ? JSON.stringify(eventData) : null,
        };

        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`${method} request failed for ${url}:`, errorData.message || 'Unknown error');
            throw new Error(errorData.message || 'Failed to complete request');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        console.error('API Request Error:', error);
        throw error; // Rethrow error to handle it in the calling function
    }
};

// Function to create a new event
export const createEvent = async (eventData) => {
    try {
        const data = await apiRequest('/api/events', 'POST', eventData);
        console.log('Event created successfully:', data);
        return data;
    } catch (error) {
        alert('An error occurred while creating the event. Please try again later.');
        return null;
    }
};

// Function to update an event
export const updateEvent = async (eventId, eventData) => {
    try {
        const data = await apiRequest(`/api/events/${eventId}`, 'PUT', eventData);
        console.log('Event updated successfully:', data);
        return data;
    } catch (error) {
        alert('An error occurred while updating the event. Please try again later.');
        return null;
    }
};

// Function to delete an event
export const deleteEvent = async (eventId) => {
    try {
        const data = await apiRequest(`/api/events/${eventId}`, 'DELETE');
        console.log('Event deleted successfully:', data);
        return data;
    } catch (error) {
        alert('An error occurred while deleting the event. Please try again later.');
        return null;
    }
};


// Function to list all events
export const listEvents = async (signal) => {
    try {
        const data = await apiRequest('/api/events', 'GET', null, signal);
        console.log('Fetched events:', data);
        return data;
    } catch (error) {
        console.error('Error fetching events:', error);
        return null;
    }
};


// Function to rate  events
export const rateEvents = async (signal) => {
    try {
        const data = await apiRequest('/api/events/rating', 'POST', null, signal);
        console.log('Fetched events:', data);
        return data;
    } catch (error) {
        console.error('Error fetching events:', error);
        return null;
    }
};