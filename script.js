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

// Function to fetch and download videos
const fetchAndDownloadVideos = async () => {
  readApiKey();
  // Read API key from localStorage
  const apiKey = localStorage.getItem('apiKey');
  if (!apiKey) {
    console.error('API Key not found');
    return;
  }

  const query = document.getElementById('keywords').value;
  let currentPage = 1; // Initialize current page number
  const perPage = document.getElementById('numVideos').value;
  const orientation = document.getElementById('orientation').value;
  const size = document.getElementById('size').value;
  const downloadDelay = 3000;

  const loader = document.getElementById('loader');
  loader.style.display = 'flex'; // Show loader
  document.getElementById('status').innerHTML = ''; // Reset status

  try {
    while (true) {
      const url = `https://api.pexels.com/videos/search?query=${query}&per_page=${80}&page=${currentPage}&orientation=${orientation}&size=${size}`;
      const headers = { Authorization: apiKey };

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();

      // Read downloaded video IDs from localStorage
      const downloadedVideoIds = readDownloadedVideoIds();

      let videosDownloaded = 0; // Counter for downloaded videos on this page

      for (const video of data.videos) {
        const videoId = video.id;
        // Check if video ID has already been downloaded
        if (!downloadedVideoIds.includes(videoId) && videosDownloaded < parseInt(perPage)) {
          let videoUrl;
          // Determine video URL based on size
          if (size === 'small') {
            videoUrl = video.video_files.find((file) => file.quality === 'sd')?.link;
          } else if (size === 'medium') {
            videoUrl =
              video.video_files.find((file) => file.quality === 'hd' && file.height >= 1080)
                ?.link || video.video_files.find((file) => file.quality === 'uhd')?.link;
          } else {
            videoUrl = video.video_files.find((file) => file.quality === 'uhd')?.link;
          }
          // Download the video if URL is found
          if (videoUrl) {
            const fileName = `${videoId}_${videoUrl.split('/').pop()}`;
            await downloadVideo(videoUrl, fileName);
            await new Promise((resolve) => setTimeout(resolve, downloadDelay));
            // Add video ID to downloadedVideoIds array
            downloadedVideoIds.push(videoId);
            videosDownloaded++; // Increment counter for downloaded videos
          }
        }
      }

      // Write updated downloaded video IDs to localStorage
      writeDownloadedVideoIds(downloadedVideoIds);

      // If no new videos were downloaded on this page, proceed to the next page
      if (videosDownloaded < parseInt(perPage)) {
        currentPage++; // Move to the next page
      } else {
        break;
      }
    }

    document.getElementById('status').innerHTML += '<p>All videos downloaded successfully!</p>';
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('status').innerHTML += `<p>Error: ${error.message}</p>`;
  } finally {
    loader.style.display = 'none'; // Hide loader after download process completes
  }
};

const downloadVideo = async (videoUrl, fileName) => {
  try {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    document.getElementById('status').innerHTML += `<p>Downloaded: ${fileName}</p>`;
  } catch (error) {
    console.error(`Error downloading ${fileName}:`, error);
  }
};
