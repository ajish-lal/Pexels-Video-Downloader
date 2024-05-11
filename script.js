const fetchAndDownloadVideos = async () => {
  const API_KEY = 'api_key';
  const query = document.getElementById('keywords').value;
  const perPage = document.getElementById('numVideos').value;
  const orientation = document.getElementById('orientation').value;
  const size = document.getElementById('size').value;
  const downloadDelay = 3000;

  const loader = document.getElementById('loader');
  loader.style.display = 'flex'; // Show loader
  document.getElementById('status').innerHTML = '';

  const url = `https://api.pexels.com/videos/search?query=${query}&per_page=${perPage}&orientation=${orientation}&size=${size}`;
  const headers = { Authorization: API_KEY };

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();

    for (const video of data.videos) {
      let videoUrl;
      if (size === 'small') {
        videoUrl = video.video_files.find((file) => file.quality === 'sd')?.link;
      } else if (size === 'medium') {
        videoUrl =
          video.video_files.find((file) => file.quality === 'hd' && file.height >= 1080)?.link ||
          video.video_files.find((file) => file.quality === 'uhd')?.link;
      } else {
        videoUrl = video.video_files.find((file) => file.quality === 'uhd')?.link;
      }

      if (videoUrl) {
        const fileName = `${video.id}_${videoUrl.split('/').pop()}`;
        await downloadVideo(videoUrl, fileName);
        await new Promise((resolve) => setTimeout(resolve, downloadDelay));
      }
    }

    document.getElementById('status').innerHTML += '<p>All videos downloaded successfully!</p>';
  } catch (error) {
    console.error('Error:', error);
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
