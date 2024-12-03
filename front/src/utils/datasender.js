const sendLocalStorageDataToBackend = async () => {
  try {
    // Fetch local storage data
    const favoriteFestivals =
      JSON.parse(localStorage.getItem("favoriteFestivals")) || [];
    const favoriteHeritages =
      JSON.parse(localStorage.getItem("favoriteHeritages")) || [];

    console.log("Favorite Festivals:", favoriteFestivals); // Debugging local storage content
    console.log("Favorite Heritages:", favoriteHeritages);

    // Ensure data exists before sending
    if (!favoriteFestivals.length && !favoriteHeritages.length) {
      console.error("No data in localStorage to send.");
      return;
    }

    // Prepare payload
    const payload = {
      favoriteFestivals,
      favoriteHeritages,
    };

    console.log("Payload to send:", payload);

    // Send data to the backend
    const response = await fetch("http://localhost:8000/api/store-favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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

sendLocalStorageDataToBackend();
