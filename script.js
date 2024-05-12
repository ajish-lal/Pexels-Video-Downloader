const downloadDelay = 5000;

const delayerFunction = async () =>
  await new Promise((resolve) => setTimeout(resolve, downloadDelay));

const startOperation = async () => {
  const keywords = document
    .getElementById('keywords')
    .value.split(',')
    .map((keyword) => keyword.trim());

  for (let index = 0; index < keywords.length; index++) {
    const keyword = keywords[index];
    await fetchAndDownloadVideos(keyword, index + 1);
    await delayerFunction();
  }
};
