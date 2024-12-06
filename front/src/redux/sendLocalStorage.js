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

// const fetchAndReinsertFavorites = async () => {
//   try {
//     // Fetch data from the backend
//     const response = await fetch("http://localhost:8000/api/show-favorites");
//     if (!response.ok) {
//       throw new Error(`Failed to fetch favorites. Status: ${response.status}`);
//     }

//     const { favorites } = await response.json();
//     console.log("Fetched favorites:", favorites);

//     // Reinsert fetched data
//     const reinsertResponse = await fetch(
//       "http://localhost:8000/api/reinsert-favorites",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(favorites),
//       }
//     );

//     if (!reinsertResponse.ok) {
//       throw new Error(
//         `Failed to reinsert favorites. Status: ${reinsertResponse.status}`
//       );
//     }

//     const result = await reinsertResponse.json();
//     console.log("Reinsertion result:", result);
//   } catch (error) {
//     console.error("Error in fetch and reinsert process:", error);
//   }
// };
syncLocalStorageMiddleware();
sendLocalStorageDataToBackend();
// fetchAndReinsertFavorites();
