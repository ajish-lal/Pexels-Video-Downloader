const downloadDelay = 4000;

const delayerFunction = async () =>
  await new Promise((resolve) => setTimeout(resolve, downloadDelay));

const startOperation = async () => {
  const keywords = document
    .getElementById('keywords')
    .value.split(',')
    .map((keyword) => keyword.trim());

  const videoCheckbox = document.getElementById('videoCheckbox');
  const photoCheckbox = document.getElementById('photoCheckbox');

  for (let index = 0; index < keywords.length; index++) {
    const keyword = keywords[index];
    if (videoCheckbox.checked && photoCheckbox.checked) {
      await fetchAndDownloadVideos(keyword, index + 1);
      await fetchAndDownloadImages(keyword, index + 1);
    } else if (videoCheckbox.checked) {
      await fetchAndDownloadVideos(keyword, index + 1);
    } else if (photoCheckbox.checked) {
      await fetchAndDownloadImages(keyword, index + 1);
    }
  }
};
