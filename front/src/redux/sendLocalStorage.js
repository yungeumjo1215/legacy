const syncLocalStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action); // Dispatch the action
  const state = store.getState(); // Get the updated state

  // Sync specific parts of the Redux state to localStorage
  if (state.favorites) {
    localStorage.setItem(
      "favoriteFestivals",
      JSON.stringify(state.favorites.festivals || [])
    );
    localStorage.setItem(
      "favoriteHeritages",
      JSON.stringify(state.favorites.heritages || [])
    );
  }

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

// Function to send localStorage data to the backend
const sendLocalStorageDataToBackend = async () => {
  try {
    // Fetch data from localStorage
    const token = localStorage.getItem("token");
    const favoriteFestivals =
      JSON.parse(localStorage.getItem("favoriteFestivals")) || [];
    const favoriteHeritages =
      JSON.parse(localStorage.getItem("favoriteHeritages")) || [];

    // Debugging localStorage content
    console.log("Favorite Festivals:", favoriteFestivals);
    console.log("Favorite Heritages:", favoriteHeritages);

    // Ensure there's data to send
    if (!favoriteFestivals.length && !favoriteHeritages.length) {
      console.error("No data in localStorage to send.");
      return;
    }

    // Prepare payload
    const payload = {
      favoriteFestivals,
      favoriteHeritages,
      token,
    };

    console.log("Payload to send:", payload);

    // Send data to the backend
    const response = await fetch("http://localhost:8000/api/store-favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify(payload), // Convert payload to JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from backend:", errorData);
      throw new Error(`Failed to send data. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Data successfully sent to backend:", result);
  } catch (error) {
    console.error("Error sending data to backend:", error);
  }
};

function sendDataToPostgreSQL() {
  // Fetch data from localStorage
  const favoriteFestivals =
    JSON.parse(localStorage.getItem("favoriteFestivals")) || [];
  const favoriteHeritages =
    JSON.parse(localStorage.getItem("favoriteHeritages")) || [];
  const token = localStorage.getItem("token"); // Assume token is stored in localStorage

  if (!token) {
    console.error("Token is missing. Cannot send data.");
    return;
  }

  // Previous favorite data fetched from localStorage to identify deleted items
  const previousFavoriteFestivals =
    JSON.parse(localStorage.getItem("previousFavoriteFestivals")) || [];
  const previousFavoriteHeritages =
    JSON.parse(localStorage.getItem("previousFavoriteHeritages")) || [];

  // Identify items to delete
  const festivalsToDelete = previousFavoriteFestivals.filter(
    (prev) =>
      !favoriteFestivals.some(
        (current) =>
          current.programName === prev.programName &&
          current.location === prev.location
      )
  );

  const heritagesToDelete = previousFavoriteHeritages.filter(
    (prev) =>
      !favoriteHeritages.some(
        (current) =>
          current.ccbamnm1 === prev.ccbamnm1 &&
          current.ccbalcad === prev.ccbalcad
      )
  );

  // Debugging: Log data being sent to the backend
  // console.log("Favorite Festivals:", favoriteFestivals);
  // console.log("Favorite Heritages:", favoriteHeritages);
  // console.log("Festivals to Delete:", festivalsToDelete);
  // console.log("Heritages to Delete:", heritagesToDelete);

  // Send data to the backend
  fetch("http://localhost:8000/api/store-favoritesPGDB", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({
      favoriteFestivals,
      favoriteHeritages,
      festivalsToDelete,
      heritagesToDelete,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        console.log("Data successfully sent to PostgreSQL:", data.message);

        // Update "previous" localStorage after successful sync
        localStorage.setItem(
          "previousFavoriteFestivals",
          JSON.stringify(favoriteFestivals)
        );
        localStorage.setItem(
          "previousFavoriteHeritages",
          JSON.stringify(favoriteHeritages)
        );
      } else {
        console.error("Error sending data:", data.error || data);
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

syncLocalStorageMiddleware();
sendLocalStorageDataToBackend();
sendDataToPostgreSQL();
