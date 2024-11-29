// Function to create a new club
const create = async (club, credentials) => {
  try {
    // Send a POST request to create the club
    let response = await fetch("/api/clubs/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify(club),
    });

    // Parse the response JSON
    const data = await response.json();

    // Check if the response is successful (status code 2xx)
    if (response.ok) {
      alert("Club created successfully!");
      return data; // Return the data of the newly created club
    } else {
      alert(
        "Error creating club: " + (data.message || "Something went wrong.")
      );
      return null; // Return null if creation fails
    }
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred while creating the club. Please try again later.");
    return null; // Return null in case of any error
  }
};

// Function to list all clubs
const list = async (signal, query) => {
  try {
    let uri = "/api/clubs";
    if (query) {
      Object.entries(query).map(([key, value]) => {
        uri += `?${key}=${value}`;
      });
    }
    let response = await fetch(uri, {
      method: "GET",
      signal: signal,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch clubs");
    }

    // Return the list of clubs
    return await response.json();
  } catch (err) {
    console.error("Error fetching clubs:", err);
    return null; // Return null in case of error
  }
};

// Function to read a specific club's details by ID
const read = async (params, signal) => {
  try {
    let response = await fetch(`/api/clubs/${params.clubId}`, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching club with ID ${params.clubId}`);
    }

    return await response.json(); // Return the club data
  } catch (err) {
    console.error("Error reading club:", err);
    return null; // Return null in case of error
  }
};

// Function to update an existing club's details
const update = async (params, club, credentials) => {
  try {
    let response = await fetch(`/api/clubs/${params.clubId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify(club),
    });

    return await response.json(); // Return the updated club data
  } catch (err) {
    console.error("Error updating club:", err);
    return null; // Return null in case of error
  }
};

// Function to remove a club (delete)
const remove = async (params, credentials) => {
  try {
    let response = await fetch(`/api/clubs/${params.clubId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });

    return await response.json(); // Return the response of the delete operation
  } catch (err) {
    console.error("Error removing club:", err);
    return null; // Return null in case of error
  }
};

// Export the functions to be used in other parts of the app
export { create, list, read, update, remove };
