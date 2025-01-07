// This is a temporary development solution
// TODO: Move this to a secure backend service
export const OPENAI_API_KEY = "your-api-key-here";

export const initializeSettings = () => {
  // Only set the API key if it's not already in localStorage
  if (!localStorage.getItem("OPENAI_API_KEY")) {
    localStorage.setItem("OPENAI_API_KEY", OPENAI_API_KEY);
  }
};