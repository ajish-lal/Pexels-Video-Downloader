// Function to fetch and download images
const fetchAndDownloadImages = async (keywords, parentIndex) => {
  readApiKey();
  // Read API key from localStorage
  const apiKey = localStorage.getItem('apiKey');
  if (!apiKey) {
    console.error('API Key not found');
    return;
  }

  let currentPage = 1; // Initialize current page number
  const perPage = document.getElementById('numMedia').value;
  const orientation = document.getElementById('orientation').value;
  const size = document.getElementById('size').value;

  const loader = document.getElementById('loader');
  loader.style.display = 'flex'; // Show loader
  document.getElementById('status').innerHTML = ''; // Reset status

  try {
    // Read downloaded image IDs from localStorage
    const downloadedImageIds = readDownloadedMediaIds('image');

    while (true) {
      const url = `https://api.pexels.com/v1/search?query=${keywords}&per_page=${80}&page=${currentPage}&orientation=${orientation}&size=${size}`; // API endpoint for images
      const headers = { Authorization: apiKey };

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();

      let imagesDownloaded = 0; // Counter for downloaded images on this page

      if (data.photos.length === 0) {
        document.getElementById(
          'status'
        ).innerHTML = `<p>Error: No images present for the keyword "${keywords}"</p>`;
        break;
      }

      await delayerFunction();

      for (let index = 0; index < data.photos.length; index++) {
        const photo = data.photos[index];
        const photoId = photo.id;
        // Check if image ID has already been downloaded
        if (!downloadedImageIds.includes(photoId) && imagesDownloaded < parseInt(perPage)) {
          let imageUrl = photo.src['original']; // Adjust for different image sizes if needed

          // Download the image if URL is found
          if (imageUrl) {
            const fileName = `${parentIndex}_${index}__${keywords}__${imageUrl.split('.').pop()}`;
            await downloadMedia(imageUrl, fileName);
            await delayerFunction();
            // Add image ID to downloadedImageIds array
            downloadedImageIds.push(photoId);
            imagesDownloaded++; // Increment counter for downloaded images
          }
        }
      }

      // Write updated downloaded image IDs to localStorage
      writeDownloadedMediaIds(downloadedImageIds, 'image');

      // If no new images were downloaded on this page, proceed to the next page
      if (imagesDownloaded < parseInt(perPage)) {
        currentPage++; // Move to the next page
      } else {
        break;
      }
    }

    document.getElementById('status').innerHTML += '<p>All images downloaded successfully!</p>';
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('status').innerHTML += `<p>Error: ${error.message}</p>`;
  } finally {
    loader.style.display = 'none'; // Hide loader after download process completes
  }
};
