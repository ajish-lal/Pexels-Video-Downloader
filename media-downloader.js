const downloadMedia = async (mediaUrl, fileName) => {
  try {
    const response = await fetch(mediaUrl);
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
