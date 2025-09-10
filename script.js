// Toggle Mode Buttons
const eleganceBtn = document.getElementById('eleganceBtn');
const chaosBtn = document.getElementById('chaosBtn');
const compareBtn = document.getElementById('compareBtn');

const austenPanel = document.querySelector('.panel.austen');
const modernPanel = document.querySelector('.panel.modern');

eleganceBtn.addEventListener('click', () => {
  austenPanel.style.display = 'block';
  modernPanel.style.display = 'none';
});

chaosBtn.addEventListener('click', () => {
  austenPanel.style.display = 'none';
  modernPanel.style.display = 'block';
});

compareBtn.addEventListener('click', () => {
  austenPanel.style.display = 'block';
  modernPanel.style.display = 'block';
});

// Austen Quotient Logic
function calculateAustenQuotient(text) {
  const sentences = text.split(/[.!?]/).filter(s => s.trim());
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / Math.max(sentences.length, 1);

  const semicolons = (text.match(/;/g) || []).length;
  const rareWords = text.split(/\s+/).filter(word => word.length > 10).length;
  const passiveVoice = (text.match(/\bwas\b|\bwere\b/gi) || []).length;
  const dialogueLines = text.split('\n').filter(line => /["“”]/.test(line)).length;
  const emotionalWords = (text.match(/\blove|hate|joy|despair|admire|fear|hope|longing|affection|regret\b/gi) || []).length;
  const flair = (text.match(/!|\.{3}/g) || []).length;

  const score = (
    (avgSentenceLength * 0.25) +
    (semicolons * 0.15) +
    (rareWords * 0.15) +
    (passiveVoice * 0.10) +
    (dialogueLines * 0.10) +
    (emotionalWords * 0.15) +
    (flair * 0.10)
  );

  return {
    score: score.toFixed(2),
    breakdown: {
      avgSentenceLength: avgSentenceLength.toFixed(2),
      semicolons,
      rareWords,
      passiveVoice,
      dialogueLines,
      emotionalWords,
      flair
    }
  };
}

function labelAustenScore(score) {
  score = parseFloat(score);
  if (score >= 9) return "Austen would be proud.";
  if (score >= 6) return "Respectable prose with potential.";
  if (score >= 3) return "Witty-paced with flashes of brilliance.";
  return "Needs a strong cup of tea and a rewrite.";
}

// Modern Quotient Logic
function calculateModernQuotient(text) {
  const sentences = text.split(/[.!?]/).filter(s => s.trim());

  const fragmentedSentences = sentences.filter(s => s.trim().split(/\s+/).length <= 6).length;
  const emotionalExtremes = (text.match(/\b(obsessed|destroyed|ecstatic|broken|devastated|unhinged|screaming|crying|dying)\b/gi) || []).length;
  const firstPersonIntensity = (text.match(/\b(I|me|my|mine|myself)\b/gi) || []).length;
  const ellipsesDashes = (text.match(/(\.\.\.|—)/g) || []).length;
  const swearWords = (text.match(/\b(fuck|shit|bitch|damn|hell|suck|crap)\b/gi) || []).length;
  const popCultureRefs = (text.match(/\b(Taylor Swift|Starbucks|Instagram|Netflix|Snapchat|TikTok|Spotify)\b/gi) || []).length;
  const capitalizedEmphasis = (text.match(/\b[A-Z]{3,}\b/g) || []).length;

  const score = (
    (fragmentedSentences * 0.20) +
    (emotionalExtremes * 0.20) +
    (firstPersonIntensity * 0.15) +
    (ellipsesDashes * 0.10) +
    (swearWords * 0.10) +
    (popCultureRefs * 0.15) +
    (capitalizedEmphasis * 0.10)
  );

  return {
    score: score.toFixed(2),
    breakdown: {
      fragmentedSentences,
      emotionalExtremes,
      firstPersonIntensity,
      ellipsesDashes,
      swearWords,
      popCultureRefs,
      capitalizedEmphasis
    }
  };
}

function labelModernScore(score) {
  score = parseFloat(score);
  if (score >= 9) return "Emotionally devastating in the best way.";
  if (score >= 6) return "Wattpad-coded with emotional whiplash.";
  if (score >= 3) return "Reads like a group chat meltdown.";
  return "Bro this is...embarrasing.";
}

// Analysis Function
function analyzeText(label) {
  const text = label === 'austen'
    ? document.getElementById('austenText').value
    : document.getElementById('modernText').value;

  if (!text.trim()) {
    alert("Please paste some text before analyzing.");
    return;
  }

  const result = label === 'austen'
    ? calculateAustenQuotient(text)
    : calculateModernQuotient(text);

  const verdict = label === 'austen'
    ? labelAustenScore(result.score)
    : labelModernScore(result.score);

  const outputDiv = label === 'austen'
    ? document.querySelector('.austen-output')
    : document.querySelector('.modern-output');

  outputDiv.innerHTML = `
    <div class="analysis-result">
      <p><strong>${label === 'austen' ? 'Austen Quotient' : 'Modern Quotient'}:</strong> ${result.score}</p>
      <p><strong>Verdict:</strong> ${verdict}</p>
      <details>
        <summary>📊 Breakdown</summary>
        <ul>
          ${Object.entries(result.breakdown).map(([key, value]) => `<li>${formatLabel(key)}: ${value}</li>`).join('')}
        </ul>
      </details>
    </div>
  `;
}

function formatLabel(key) {
  const labels = {
    avgSentenceLength: "Avg Sentence Length",
    semicolons: "Semicolons",
    rareWords: "Rare Words",
    passiveVoice: "Passive Voice",
    dialogueLines: "Dialogue Lines",
    emotionalWords: "Emotional Words",
    flair: "Punctuation Flair",
    fragmentedSentences: "Fragmented Sentences",
    emotionalExtremes: "Emotional Extremes",
    firstPersonIntensity: "First-Person Intensity",
    ellipsesDashes: "Ellipses & Dashes",
    swearWords: "Swear Words",
    popCultureRefs: "Pop Culture References",
    capitalizedEmphasis: "Capitalized Emphasis"
  };
  return labels[key] || key;
}

// File Upload Auto-Fill
document.getElementById('austenUpload').addEventListener('change', function () {
  const file = this.files[0];
  if (file && file.type === 'text/plain') {
    const reader = new FileReader();
    reader.onload = function () {
      document.getElementById('austenText').value = reader.result;
    };
    reader.readAsText(file);
  }
});

document.getElementById('modernUpload').addEventListener('change', function () {
  const file = this.files[0];
  if (file && file.type === 'text/plain') {
    const reader = new FileReader();
    reader.onload = function () {
      document.getElementById('modernText').value = reader.result;
    };
    reader.readAsText(file);
  }
});