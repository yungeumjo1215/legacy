const syncLocalStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action); // Dispatch the action
  const state = store.getState(); // Get the updated state

  // Sync token to localStorage (if it exists in the state)
  if (state.auth && state.auth.token) {
    console.log("Syncing token to localStorage:", state.auth.token);
    localStorage.setItem("token", state.auth.token);
  } else {
    console.log("No token to sync.");
  }

  return result;
};

export default syncLocalStorageMiddleware;

function sendDataToPostgreSQL() {
  const token = localStorage.getItem("token"); // Assume token is stored in localStorage

  if (!token) {
    console.error("Token is missing. Cannot send data.");
    return;
  }

  // Debugging: Log the token being sent to the backend
  console.log("Token being sent to the backend:", token);

  // Send only the token to the backend
  fetch("http://localhost:8000/pgdb/favoritelist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Pass token in Authorization header
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        console.log("Token successfully sent to PostgreSQL:", data.message);
      } else {
        console.error("Error sending token:", data.error || data);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// Call functions
syncLocalStorageMiddleware();
sendDataToPostgreSQL();
