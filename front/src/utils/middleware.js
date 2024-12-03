import { sendLocalStorageDataToBackend } from "./datasender"; // Import the data sender function

const stateSyncMiddleware = (store) => (next) => async (action) => {
  // Call the next middleware or reducer
  const result = next(action);

  // Check if the `favorites` slice is updated
  const state = store.getState();
  const { heritages, festivals } = state.favorites;

  // Trigger backend sync if `favorites` slice has changes
  if (action.type.includes("favorites")) {
    if (heritages.length || festivals.length) {
      console.log("Detected updates in favorites, syncing with backend...");
      await sendLocalStorageDataToBackend(() => state); // Pass current state
    }
  }

  return result;
};

export default stateSyncMiddleware;
