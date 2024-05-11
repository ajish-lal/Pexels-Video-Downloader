const startOperation = async () => {
  const keywords = document
    .getElementById('keywords')
    .value.split(',')
    .map((keyword) => keyword.trim());

  for (const keyword of keywords) {
    await fetchAndDownloadVideos(keyword);
  }
};
