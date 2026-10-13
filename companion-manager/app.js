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
    title: 'Athadu Punctuality',
    teluguQuote: 'ఒక్కసారి కమిట్ అయితే నా మాట నేనే వినను',
    englishMeaning: 'Once I commit to my schedule, even I don’t listen to myself',
    characterOrScene: 'Mahesh Babu Athadu / Pokiri punch',
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
    description: 'Completed a full month of rigorous syllabus!',
    memeQuote: 'Oka sari commit aithe, naa syllabus maata nene vinanu!',
    badgeType: 'monthly',
    iconName: 'trophy',
    color: '#8B5CF6',
  },
];

function renderMemes() {
  const container = document.getElementById('memeList');
  container.innerHTML = '';
  memes.forEach((m, idx) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div>
        <div class="item-title">${m.title}</div>
        <div class="item-telugu">${m.teluguQuote}</div>
        <div class="item-desc">Meaning: ${m.englishMeaning}</div>
        <div class="item-quote">Ref: ${m.characterOrScene}</div>
      </div>
      <div class="item-footer">
        <span class="tag">${m.category}</span>
        <div class="item-actions">
          <button class="btn-icon" onclick="deleteMeme(${idx})">🗑️</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderBadges() {
  const container = document.getElementById('badgeList');
  container.innerHTML = '';
  badges.forEach((b, idx) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div>
        <div class="item-title">${b.title}</div>
        <div class="item-telugu">${b.teluguTitle}</div>
        <div class="item-desc">${b.description}</div>
        <div class="item-quote">“${b.memeQuote}”</div>
      </div>
      <div class="item-footer">
        <span class="tag tag-${b.badgeType}">${b.badgeType}</span>
        <div class="item-actions">
          <button class="btn-icon" onclick="deleteBadge(${idx})">🗑️</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

window.deleteMeme = function(idx) {
  if (confirm(`Delete meme "${memes[idx].title}"?`)) {
    memes.splice(idx, 1);
    renderMemes();
  }
};

window.deleteBadge = function(idx) {
  if (confirm(`Delete badge "${badges[idx].title}"?`)) {
    badges.splice(idx, 1);
    renderBadges();
  }
};

document.getElementById('addMemeBtn').addEventListener('click', () => {
  const title = prompt('Enter Meme Reference Title:');
  if (!title) return;
  const teluguQuote = prompt('Enter Telugu Dialogue / Quote:');
  const englishMeaning = prompt('Enter English Meaning / Context:');
  const characterOrScene = prompt('Enter Character or Movie Reference:');

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
    color: '#4F46E5',
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
  const tsContent = `// Generated from Companion Manager
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
