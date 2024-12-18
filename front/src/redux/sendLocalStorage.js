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

syncLocalStorageMiddleware();
