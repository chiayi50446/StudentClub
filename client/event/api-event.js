const apiUrl =
    process.env.NODE_ENV === "development" ? "" : import.meta.env.VITE_API_URL;

// Helper function to handle API requests
const apiRequest = async (
    url,
    method,
    eventData = null,
    signal = null,
    credentials = null
) => {
    try {
        const options = {
            method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + credentials?.t,
            },
            body: eventData ? JSON.stringify(eventData) : null,
            signal,
        };

        const response = await fetch(apiUrl + url, options);

        if (!response.ok) {
            const errorData = await response.json();
            console.error(
                `${method} request failed for ${url}:`,
                errorData.message || "Unknown error"
            );
            throw new Error(errorData.message || "Failed to complete request");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Request Error:", error);
        throw error;
    }
};

export const createEvent = async (eventData, credentials) => {
    try {
        const data = await apiRequest(
            "/api/events",
            "POST",
            eventData,
            null,
            credentials
        );
        return data;
    } catch (error) {
        alert(
            "An error occurred while creating the event. Please try again later."
        );
        return null;
    }
};

export const updateEvent = async (eventId, eventData, credentials) => {
    try {
        const data = await apiRequest(
            `/api/events/${eventId}`,
            "PUT",
            eventData,
            null,
            credentials
        );
        return data;
    } catch (error) {
        alert(
            "An error occurred while updating the event. Please try again later."
        );
        return null;
    }
};

export const deleteEvent = async (eventId, credentials) => {
    try {
        const data = await apiRequest(
            `/api/events/${eventId}`,
            "DELETE",
            null,
            null,
            credentials
        );
        return data;
    } catch (error) {
        alert(
            "An error occurred while deleting the event. Please try again later."
        );
        return null;
    }
};

export const listEvents = async (signal) => {
    try {
        const data = await apiRequest("/api/events", "GET", null, signal);
        return data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return null;
    }
};

export const readEvent = async (eventId, signal) => {
    try {
        const data = await apiRequest(
            `/api/events/${eventId}`,
            "GET",
            null,
            signal
        );
        return data;
    } catch (error) {
        console.log(error);
        alert('An error occurred while read the event. Please try again later.');
        return null;
    }
};

export const rateEvents = async (signal) => {
    try {
        const data = await apiRequest("/api/events/rating", "POST", null, signal);
        return data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return null;
    }
};
