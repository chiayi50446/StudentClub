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
    return data; // Return the response data
  } catch (error) {
    console.error("API Request Error:", error);
    throw error; // Rethrow error to handle it in the calling function
  }
};

// Function to create a new event
export const createEvent = async (eventData, credentials) => {
  try {
    // Include club ID in the event data
    const data = await apiRequest(
      "/api/events",
      "POST",
      eventData,
      null,
      credentials
    );
    console.log("Event created successfully:", data);
    return data;
  } catch (error) {
    alert(
      "An error occurred while creating the event. Please try again later."
    );
    return null;
  }
};

// Function to update an event
export const updateEvent = async (eventId, eventData, credentials) => {
  try {
    // Include club ID in the event data for update
    const data = await apiRequest(
      `/api/events/${eventId}`,
      "PUT",
      eventData,
      null,
      credentials
    );
    console.log("Event updated successfully:", data);
    return data;
  } catch (error) {
    alert(
      "An error occurred while updating the event. Please try again later."
    );
    return null;
  }
};

// Function to delete an event
export const deleteEvent = async (eventId, credentials) => {
  try {
    const data = await apiRequest(
      `/api/events/${eventId}`,
      "DELETE",
      null,
      null,
      credentials
    );
    console.log("Event deleted successfully:", data);
    return data;
  } catch (error) {
    alert(
      "An error occurred while deleting the event. Please try again later."
    );
    return null;
  }
};

// Function to list all events (including associated club data)
export const listEvents = async (signal) => {
  try {
    const data = await apiRequest("/api/events", "GET", null, signal);
    console.log("Fetched events:", data);
    return data; // The response should contain event data including associated club
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
    console.log("Fetched events:", data);
    return data;
  } catch (error) {
    console.log(error);
    // alert('An error occurred while read the event. Please try again later.');
    return null;
  }
};

// Function to rate  events
export const rateEvents = async (signal) => {
  try {
    const data = await apiRequest("/api/events/rating", "POST", null, signal);
    console.log("Fetched events:", data);
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return null;
  }
};
