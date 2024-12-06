const apiUrl = (process.env.NODE_ENV === 'development') ? '' : import.meta.env.VITE_API_URL;

const create = async (club, credentials) => {
    try {
        let response = await fetch(`${apiUrl}api/clubs/`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + credentials.t,
            },
            body: JSON.stringify(club),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Club created successfully!");
            return data;
        } else {
            alert(
                "Error creating club: " + (data.message || "Something went wrong.")
            );
            return null;
        }
    } catch (err) {
        console.error("Error:", err);
        alert("An error occurred while creating the club. Please try again later.");
        return null;
    }
};

const list = async (signal, query) => {
    try {
        let uri = `${apiUrl}/api/clubs`;
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
        let response = await fetch(`${apiUrl}/api/clubs/${params.clubId}`, {
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
        let response = await fetch(`${apiUrl}/api/clubs/${params.clubId}`, {
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
        let response = await fetch(`${apiUrl}/api/clubs/${params.clubId}`, {
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
