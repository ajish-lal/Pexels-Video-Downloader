const handleFile = (input) => {
  const file = input.files[0];

  if (!file) {
    console.error('No file selected');
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const fileContent = event.target.result;
    const keywords = extractKeywords(fileContent);
    document.getElementById('keywords').value = keywords;
  };

  reader.readAsText(file);
};

const extractKeywords = (fileContent) => {
  let keywords = '';
  try {
    const keywordsObj = JSON.parse(fileContent);
    for (const key in keywordsObj) {
      keywords += `${keywordsObj[key].join(', ')}, `;
    }
  } catch (error) {
    console.log('Keywords file is not in JSON format');
    // Split file content by lines
    const lines = fileContent.split('\n');

    // Iterate over each line
    lines.forEach((line) => {
      // Split line by ':'
      const parts = line.split(':');
      if (parts.length === 2) {
        const keyword = parts[0].trim();
        const relatedWords = parts[1].split(',').map((word) => word.trim());
        keywords += `${relatedWords.join(', ')}, `;
      }
    });
  } finally {
    return keywords.replace(/,\s*$/, '');
  }
};
