// Function to fetch and download videos
const fetchAndDownloadVideos = async (keywords, parentIndex) => {
  readApiKey();
  // Read API key from localStorage
  const apiKey = localStorage.getItem('apiKey');
  if (!apiKey) {
    console.error('API Key not found');
    return;
  }

  let currentPage = 1; // Initialize current page number
  const perPage = document.getElementById('numVideos').value;
  const orientation = document.getElementById('orientation').value;
  const size = document.getElementById('size').value;
  const downloadDelay = 5000;

  const loader = document.getElementById('loader');
  loader.style.display = 'flex'; // Show loader
  document.getElementById('status').innerHTML = ''; // Reset status

  try {
    while (true) {
      const url = `https://api.pexels.com/videos/search?query=${keywords}&per_page=${80}&page=${currentPage}&orientation=${orientation}&size=${size}`;
      const headers = { Authorization: apiKey };

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();

      // Read downloaded video IDs from localStorage
      const downloadedVideoIds = readDownloadedVideoIds();

      let videosDownloaded = 0; // Counter for downloaded videos on this page

      if (data.videos.length === 0) {
        document.getElementById(
          'status'
        ).innerHTML = `<p>Error: No videos present for the keyword "${keywords}"</p>`;
        break;
      }

      for (let index = 0; index < data.videos.length; index++) {
        const video = data.videos[index];
        // for (const video of data.videos) {
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
            const fileName = `${parentIndex}_${index}__${keywords}__${videoUrl.split('/').pop()}`;
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
        await new Promise((resolve) => setTimeout(resolve, downloadDelay));
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
