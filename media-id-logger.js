// Function to read downloaded media IDs from localStorage
const readDownloadedMediaIds = (mediaType) => {
  try {
    const data = localStorage.getItem(
      `downloaded${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}s`
    );
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading downloaded ${mediaType} IDs:`, error);
    return [];
  }
};

// Function to write downloaded media IDs to localStorage
const writeDownloadedMediaIds = (mediaIds, mediaType) => {
  try {
    localStorage.setItem(
      `downloaded${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}s`,
      JSON.stringify(mediaIds)
    );
  } catch (error) {
    console.error(`Error writing downloaded ${mediaType} IDs:`, error);
  }
};

// Function to read API key from input and store in localStorage
const readApiKey = () => {
  const apiKey = document.getElementById('apiKey').value;
  if (apiKey) {
    localStorage.setItem('apiKey', apiKey);
  }
};

const clearStorage = () => {
  if (confirm('Are you sure you want to clear the cache?') === true) {
    localStorage.removeItem('downloadedVideos');
    localStorage.removeItem('downloadedImages');
    document.getElementById('status').innerHTML += `<p>Cache has been cleared!</p>`;
  }
};
