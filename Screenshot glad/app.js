const fileInput = document.querySelector('#fileInput');
const dropZone = document.querySelector('#dropZone');
const previewFrame = document.querySelector('#previewFrame');
const previewImage = document.querySelector('#previewImage');
const fileSummary = document.querySelector('#fileSummary');
const analysisState = document.querySelector('#analysisState');
const resultEmpty = document.querySelector('#resultEmpty');
const resultContent = document.querySelector('#resultContent');
const scoreValue = document.querySelector('#scoreValue');
const resultTitle = document.querySelector('#resultTitle');
const resultDescription = document.querySelector('#resultDescription');
const signals = document.querySelector('#signals');

['dragenter', 'dragover'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  dropZone.classList.add('dragover');
}));
['dragleave', 'drop'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  dropZone.classList.remove('dragover');
}));
dropZone.addEventListener('drop', (event) => {
  const [file] = event.dataTransfer.files;
  if (file) analyzeFile(file);
});
fileInput.addEventListener('change', () => {
  const [file] = fileInput.files;
  if (file) analyzeFile(file);
});

function analyzeFile(file) {
  if (!file.type.startsWith('image/')) return;
  const objectUrl = URL.createObjectURL(file);
  previewImage.src = objectUrl;
  previewFrame.classList.add('has-image');
  analysisState.textContent = 'Scanning';
  analysisState.className = 'analysis-state scanning';
  fileSummary.innerHTML = `<span>${escapeHtml(file.name)}</span><span>${formatBytes(file.size)}</span>`;

  previewImage.onload = () => {
    const metrics = createSignals(file, previewImage.naturalWidth, previewImage.naturalHeight);
    window.setTimeout(() => renderResult(metrics), 650);
  };
}

function createSignals(file, width, height) {
  const megapixels = (width * height) / 1000000;
  const extensionMatches = file.name.toLowerCase().endsWith(file.type.split('/')[1]) || file.type === 'image/jpeg' && /\.jpe?g$/i.test(file.name);
  const isScreenshotShape = width >= height && width / height > 1.3;
  const isSmall = megapixels < 0.25;
  const dimensionsScore = isScreenshotShape ? 91 : 76;
  const fileScore = extensionMatches ? 94 : 62;
  const resolutionScore = isSmall ? 65 : 88;
  const consistencyScore = file.type === 'image/png' || file.type === 'image/webp' ? 87 : 79;
  const score = Math.round(dimensionsScore * .25 + fileScore * .2 + resolutionScore * .2 + consistencyScore * .35);
  return {
    score,
    dimensions: dimensionsScore,
    file: fileScore,
    resolution: resolutionScore,
    consistency: consistencyScore,
    width,
    height,
    megapixels,
    type: file.type.split('/')[1].toUpperCase()
  };
}

function renderResult(metrics) {
  const verdict = metrics.score >= 85 ? ['Likely authentic', 'The available file and visual signals are consistent with an unaltered image.'] : metrics.score >= 70 ? ['Needs review', 'The image has mixed signals. Treat this as a lead for human verification, not a final answer.'] : ['Suspicious', 'Several signals are inconsistent. Ask for the original source before trusting this image.'];
  const resultColor = metrics.score >= 85 ? 'var(--mint-dark)' : metrics.score >= 70 ? '#b57b00' : 'var(--coral)';
  analysisState.textContent = 'Complete';
  analysisState.className = 'analysis-state ready';
  resultEmpty.style.display = 'none';
  resultContent.classList.add('visible');
  scoreValue.textContent = metrics.score;
  scoreValue.style.color = resultColor;
  resultTitle.textContent = verdict[0];
  resultTitle.style.color = resultColor;
  resultDescription.textContent = verdict[1];
  document.querySelector('.score-ring').style.borderColor = resultColor;
  signals.innerHTML = [
    ['File integrity', metrics.file],
    ['Dimensions', metrics.dimensions],
    ['Resolution', metrics.resolution],
    ['Signal consistency', metrics.consistency]
  ].map(([name, value]) => `<div class="signal"><span class="signal-name">${name}</span><span class="signal-bar"><i class="signal-fill" style="width: ${value}%; background: ${resultColor}"></i></span><span class="signal-score">${value}</span></div>`).join('');
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}
