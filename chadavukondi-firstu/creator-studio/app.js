// Companion Manager & Creator Studio Logic

let memes = [
  {
    id: 'meme-1',
    title: 'Chadavukondi Firstu',
    teluguQuote: 'అన్నీ ఆపేసి చదువుకోండి ఫస్టు!',
    englishMeaning: 'Stop everything else and study first!',
    characterOrScene: 'Iconic Telugu youth meme anthem',
    category: 'motivation',
  },
  {
    id: 'meme-2',
    title: 'Brahmanandam Deep Study',
    teluguQuote: 'పుస్తకం తీస్తే చాలు నిద్ర ఎందుకు వస్తుంది నాయనా?',
    englishMeaning: 'Why does sleep attack the second I open the book?',
    characterOrScene: 'Brahmi classic study expression',
    category: 'slacking_warning',
  },
  {
    id: 'meme-3',
    title: 'Pokiri Iconic Punch',
    teluguQuote: 'ఒక్కసారి కమిట్ అయితే నా మాట నేనే వినను',
    englishMeaning: 'Once I commit to my schedule, even I don’t listen to myself',
    characterOrScene: 'Mahesh Babu Pokiri dialogue',
    category: 'motivation',
  },
  {
    id: 'meme-4',
    title: 'Week Milestone Win',
    teluguQuote: 'అమ్మా... ఒక వారం సిలబస్ పూర్తి చేసాను!',
    englishMeaning: 'Mom, I finished this entire week’s syllabus!',
    characterOrScene: 'Proud student meme victory',
    category: 'completion',
  },
];

let badges = [
  {
    id: 'badge-week-1',
    title: 'Beginner Topper',
    teluguTitle: 'చదువుకోండి ఫస్టు!',
    description: 'Completed your very first study week!',
    memeQuote: 'Inka evaru matladakandi, Chadavukondi Firstu!',
    badgeType: 'weekly',
    iconName: 'school',
    color: '#E11D48',
  },
  {
    id: 'badge-week-2',
    title: 'Brahmi Focus Mode',
    teluguTitle: 'జ్ఞానం పెరుగుతోంది బ్రో',
    description: 'Maintained 2 weeks streak without distraction.',
    memeQuote: 'Nannu involve cheyaku anjali, nenu chaduvukuntunna!',
    badgeType: 'weekly',
    iconName: 'flash',
    color: '#F59E0B',
  },
  {
    id: 'badge-week-3',
    title: 'Relangi Mavayya Smile',
    teluguTitle: 'మంచి మనసుతో చదువు',
    description: 'Consistency is peaceful when Relangi vibes kick in.',
    memeQuote: 'Manchithanam tho chadivithe marks ave vasthayi mavayya!',
    badgeType: 'weekly',
    iconName: 'happy',
    color: '#10B981',
  },
  {
    id: 'badge-month-1',
    title: 'Month 1 Boss Level',
    teluguTitle: 'ఇదే నా బ్రాండ్!',
    description: 'Crushed an entire month of disciplined study goals.',
    memeQuote: 'Okkasari commit aithe na maata nene vinanu!',
    badgeType: 'monthly',
    iconName: 'trophy',
    color: '#8B5CF6',
  },
];

// Load local saved API Key
const savedApiKey = localStorage.getItem('creator_gemini_api_key') || '';
const apiKeyInput = document.getElementById('apiKeyInput');
const apiStatusBadge = document.getElementById('apiStatusBadge');
const testResultBox = document.getElementById('testResultBox');

if (savedApiKey) {
  apiKeyInput.value = savedApiKey;
  apiStatusBadge.textContent = 'API Key Configured ⚡️';
  apiStatusBadge.style.color = '#34D399';
}

document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  if (key) {
    localStorage.setItem('creator_gemini_api_key', key);
    apiStatusBadge.textContent = 'API Key Configured ⚡️';
    apiStatusBadge.style.color = '#34D399';
    alert('API Key safely saved to your local browser storage!');
  } else {
    localStorage.removeItem('creator_gemini_api_key');
    apiStatusBadge.textContent = 'Offline Synthesizer Ready';
    apiStatusBadge.style.color = '#F59E0B';
  }
});

document.getElementById('testApiKeyBtn').addEventListener('click', async () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    alert('Please enter a Google Gemini API Key first.');
    return;
  }

  testResultBox.classList.remove('hidden', 'success', 'error');
  testResultBox.textContent = 'Testing connection with Google Gemini 2.5 Flash...';

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Respond with: "Gemini connection verified!"' }] }]
      })
    });

    const data = await res.json();
    if (res.ok && data.candidates) {
      testResultBox.className = 'test-result success';
      testResultBox.textContent = '✅ Success! Connected to Gemini API successfully.';
    } else {
      testResultBox.className = 'test-result error';
      testResultBox.textContent = `❌ API Error: ${data.error?.message || 'Invalid API Key'}`;
    }
  } catch (err) {
    testResultBox.className = 'test-result error';
    testResultBox.textContent = `❌ Network Error: ${err.message}`;
  }
});

function renderMemes() {
  const list = document.getElementById('memeList');
  list.innerHTML = '';
  memes.forEach((m, idx) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div>
        <div class="item-card-header">
          <span class="item-title">${m.title}</span>
          <span class="item-category">${m.category}</span>
        </div>
        <p class="item-quote">“${m.teluguQuote}”</p>
        <p class="item-desc">${m.englishMeaning}</p>
        <p class="item-desc" style="font-size: 11px; color: #6B7280; margin-top: 4px;">🎬 ${m.characterOrScene}</p>
      </div>
      <div class="item-footer">
        <span style="font-size: 12px; color: #9CA3AF;">#${idx + 1}</span>
        <div class="card-actions">
          <button class="btn btn-secondary btn-small" onclick="editMeme('${m.id}')">Edit</button>
          <button class="btn btn-danger btn-small" onclick="deleteMeme('${m.id}')">Delete</button>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

function renderBadges() {
  const list = document.getElementById('badgeList');
  list.innerHTML = '';
  badges.forEach((b) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div>
        <div class="item-card-header">
          <span class="item-title">${b.title}</span>
          <span class="item-badge-pill" style="background-color: ${b.color}22; color: ${b.color}; border: 1px solid ${b.color}55;">
            ${b.badgeType}
          </span>
        </div>
        <p class="item-quote" style="color: ${b.color};">${b.teluguTitle}</p>
        <p class="item-desc">${b.description}</p>
        <p class="item-desc" style="font-size: 12px; font-style: italic; margin-top: 4px;">"${b.memeQuote}"</p>
      </div>
      <div class="item-footer">
        <span style="font-size: 12px; color: #9CA3AF;">Icon: ${b.iconName}</span>
        <div class="card-actions">
          <button class="btn btn-secondary btn-small" onclick="editBadge('${b.id}')">Edit</button>
          <button class="btn btn-danger btn-small" onclick="deleteBadge('${b.id}')">Delete</button>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

window.deleteMeme = function(id) {
  if (confirm('Delete this meme reference?')) {
    memes = memes.filter(m => m.id !== id);
    renderMemes();
  }
};

window.deleteBadge = function(id) {
  if (confirm('Delete this achievement badge?')) {
    badges = badges.filter(b => b.id !== id);
    renderBadges();
  }
};

document.getElementById('addMemeBtn').addEventListener('click', () => {
  const title = prompt('Enter Meme Reference Title:');
  if (!title) return;
  const teluguQuote = prompt('Enter Telugu Dialogue / Quote:');
  const englishMeaning = prompt('Enter English Meaning:');
  const characterOrScene = prompt('Enter Character / Movie Reference:');

  memes.push({
    id: `meme-${Date.now()}`,
    title,
    teluguQuote: teluguQuote || '',
    englishMeaning: englishMeaning || '',
    characterOrScene: characterOrScene || '',
    category: 'motivation',
  });
  renderMemes();
});

document.getElementById('addBadgeBtn').addEventListener('click', () => {
  const title = prompt('Enter Badge Title:');
  if (!title) return;
  const teluguTitle = prompt('Enter Telugu Title:');
  const description = prompt('Enter Description:');
  const memeQuote = prompt('Enter Meme Quote:');

  badges.push({
    id: `badge-${Date.now()}`,
    title,
    teluguTitle: teluguTitle || '',
    description: description || '',
    memeQuote: memeQuote || '',
    badgeType: 'weekly',
    iconName: 'trophy',
    color: '#818CF8',
  });
  renderBadges();
});

document.getElementById('exportJsonBtn').addEventListener('click', () => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ memes, badges }, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', 'chadavukondi_memes_and_badges.json');
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

document.getElementById('copyTsBtn').addEventListener('click', () => {
  const tsContent = `// Generated from Creator Studio & Meme Vault
import { MemeBadge, MemeReference } from '../types';

export const MEME_BADGES_CATALOG: MemeBadge[] = ${JSON.stringify(badges, null, 2)};

export const MEME_REFERENCES: MemeReference[] = ${JSON.stringify(memes, null, 2)};
`;
  navigator.clipboard.writeText(tsContent).then(() => {
    alert('Copied TypeScript code to clipboard! You can paste it into src/data/memeCatalog.ts');
  });
});

renderMemes();
renderBadges();
