// Function to read video IDs from localStorage
const readDownloadedVideoIds = () => {
  try {
    const data = localStorage.getItem('downloadedVideos');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading downloaded video IDs:', error);
    return [];
  }
};

// Function to write video IDs to localStorage
const writeDownloadedVideoIds = (videoIds) => {
  try {
    localStorage.setItem('downloadedVideos', JSON.stringify(videoIds));
  } catch (error) {
    console.error('Error writing downloaded video IDs:', error);
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
  localStorage.removeItem('downloadedVideos');
};
