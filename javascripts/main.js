const username = 'negiadventures';
const featuredRepoNames = [
  'devspace-microservices',
  'slackbot_bedrock',
  'ai-tutor',
  'market-summary-ai',
  'pubmed_analysis',
  'mortgage-atlas',
  'stock_analysis'
];
const coverMap = {
  'devspace-microservices': 'images/covers/devspace-microservices.svg',
  'slackbot_bedrock': 'images/covers/slackbot_bedrock.svg',
  'ai-tutor': 'https://raw.githubusercontent.com/negiadventures/ai-tutor/main/assets/1.png',
  'market-summary-ai': 'https://raw.githubusercontent.com/negiadventures/market-summary-ai/main/assets/1.png',
  'pubmed_analysis': 'https://raw.githubusercontent.com/negiadventures/pubmed_analysis/main/data_workflow.png',
  'mortgage-atlas': 'https://raw.githubusercontent.com/negiadventures/mortgage-atlas/main/img1.png',
  'stock_analysis': 'https://raw.githubusercontent.com/negiadventures/stock_analysis/main/assets/images/heatmap.png'
};
const descriptionOverrides = {
  'devspace-microservices': 'Microservices deployment workflows with DevSpace and Helm.',
  'slackbot_bedrock': 'Slack workflow bridge to AWS Bedrock with routing and guardrails.',
  'ai-tutor': 'AI-powered tutor that turns documents into chapter-level quizzes.',
  'market-summary-ai': 'AI-generated market briefings and signal summaries.',
  'pubmed_analysis': 'Citation network analysis across 31M+ papers and 210M+ edges.',
  'mortgage-atlas': 'Estimate true homeownership costs with scenario modeling.',
  'predicting_hotel_availability': 'Demand forecasting with ML for hotel availability.',
  'virtual-tryon': 'Virtual try-on experiments with computer vision.',
  'pathfinder-cnn': 'CNN-driven pathfinding image classifier.',
  'traffic-sign-detect-and-recognize': 'Traffic sign detection and recognition pipeline.',
  'stock_analysis': 'Stock tracking and analysis utilities.',
  'self_aware_bot': 'Trend-aware bot that monitors hot topics.'
};
const excludedRepoNames = [
  'negiadventures.github.io',
  'negiadventures',
  'algorithms',
  'poc-plotly-dash-flask',
  'fiverr-zoho-entities-csv-filter',
  'fiverr-sql-max-price-change',
  'fiverr_r_visual_analytics',
  'fiverr-py-power-analysis',
  'zendesk-intern-challenge',
  'prob-robot-target',
  'cs520',
  'ds_nano_deg_project1',
  'identify_objects_torch',
  'gettingandcleaningdata',
  'datasciencecoursera',
  'self_aware_bot'
];
const excludedRepoPatterns = [
  /\.github\.io$/i
];
const excludedRepoSet = new Set(excludedRepoNames.map((name) => name.toLowerCase()));
const repoGrid = document.getElementById('repo-grid');
const repoStatus = document.getElementById('repo-status');
const featuredGrid = document.getElementById('featured-grid');
const featuredStatus = document.getElementById('featured-status');
const repoSearch = document.getElementById('repo-search');
const repoSort = document.getElementById('repo-sort');
const repoLanguage = document.getElementById('repo-language');

let allRepos = [];
let featuredRepos = [];
let otherRepos = [];

function isInteresting(repo) {
  if (repo.fork || repo.archived) {
    return false;
  }

  const repoName = repo.name ? repo.name.toLowerCase() : '';
  if (excludedRepoSet.has(repoName)) {
    return false;
  }

  if (excludedRepoPatterns.some((pattern) => pattern.test(repo.name))) {
    return false;
  }

  const hasSignal = Boolean(repo.description || repo.language || repo.stargazers_count > 0 || repo.size > 0);
  return hasSignal;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  });
}

function updateLanguageOptions(list) {
  if (!repoLanguage) {
    return;
  }

  const languages = Array.from(new Set(list.map((repo) => repo.language).filter(Boolean))).sort();
  repoLanguage.innerHTML = '<option value="all">All languages</option>';
  languages.forEach((language) => {
    const option = document.createElement('option');
    option.value = language;
    option.textContent = language;
    repoLanguage.appendChild(option);
  });
}

function createRepoCard(repo) {
  const card = document.createElement('article');
  card.className = 'project-card';

  const coverPath = coverMap[repo.name];
  if (coverPath) {
    const cover = document.createElement('div');
    cover.className = 'project-cover';

    const coverImg = document.createElement('img');
    coverImg.src = coverPath;
    coverImg.alt = `Cover art for ${repo.name}`;
    coverImg.loading = 'lazy';

    cover.appendChild(coverImg);
    card.appendChild(cover);
  }

  const titleRow = document.createElement('div');
  titleRow.className = 'project-title';

  const title = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = repo.html_url;
  titleLink.target = '_blank';
  titleLink.rel = 'noreferrer';
  titleLink.textContent = repo.name;
  title.appendChild(titleLink);

  const visibility = document.createElement('span');
  visibility.className = 'chip';
  visibility.textContent = repo.private ? 'Private' : 'Public';

  titleRow.appendChild(title);
  titleRow.appendChild(visibility);

  const description = document.createElement('p');
  description.className = 'project-desc';
  const override = descriptionOverrides[repo.name];
  description.textContent = override || repo.description || 'No description yet.';

  const meta = document.createElement('div');
  meta.className = 'project-meta';

  if (repo.language) {
    const languageChip = document.createElement('span');
    languageChip.className = 'chip';
    languageChip.textContent = repo.language;
    meta.appendChild(languageChip);
  }

  const stars = document.createElement('span');
  stars.textContent = `Stars: ${repo.stargazers_count}`;

  const updated = document.createElement('span');
  updated.textContent = `Updated ${formatDate(repo.updated_at)}`;

  meta.appendChild(stars);
  meta.appendChild(updated);

  const links = document.createElement('div');
  links.className = 'project-links';

  const repoLink = document.createElement('a');
  repoLink.href = repo.html_url;
  repoLink.target = '_blank';
  repoLink.rel = 'noreferrer';
  repoLink.textContent = 'View repo';
  links.appendChild(repoLink);

  if (repo.homepage) {
    const liveLink = document.createElement('a');
    liveLink.href = repo.homepage;
    liveLink.target = '_blank';
    liveLink.rel = 'noreferrer';
    liveLink.textContent = 'Live demo';
    links.appendChild(liveLink);
  }

  card.appendChild(titleRow);
  card.appendChild(description);
  card.appendChild(meta);
  card.appendChild(links);

  return card;
}

function sortRepos(list, sortKey) {
  const copy = [...list];
  if (sortKey === 'stars') {
    return copy.sort((a, b) => b.stargazers_count - a.stargazers_count);
  }
  if (sortKey === 'name') {
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
  return copy.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

function resolveFeatured(list) {
  const manualNames = featuredRepoNames.map((name) => name.trim().toLowerCase()).filter(Boolean);
  let featured = [];

  if (manualNames.length) {
    featured = list.filter((repo) => manualNames.includes(repo.name.toLowerCase()));
  }

  if (!featured.length) {
    const sortedByStars = [...list].sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    featured = sortedByStars.slice(0, 3);
  }

  const featuredNames = new Set(featured.map((repo) => repo.name));
  const other = list.filter((repo) => !featuredNames.has(repo.name));
  return { featured, other };
}

function renderFeatured() {
  if (!featuredGrid || !featuredStatus) {
    return;
  }

  featuredGrid.innerHTML = '';

  if (!featuredRepos.length) {
    featuredStatus.textContent = 'No featured repositories yet.';
    return;
  }

  featuredStatus.textContent = `${featuredRepos.length} featured repositories.`;
  featuredRepos.forEach((repo) => {
    featuredGrid.appendChild(createRepoCard(repo));
  });
}

function renderRepos() {
  if (!repoGrid || !repoStatus) {
    return;
  }

  const searchTerm = repoSearch ? repoSearch.value.trim().toLowerCase() : '';
  const language = repoLanguage ? repoLanguage.value : 'all';
  const sortKey = repoSort ? repoSort.value : 'updated';

  let filtered = otherRepos.filter((repo) => {
    const matchesSearch = !searchTerm || repo.name.toLowerCase().includes(searchTerm) ||
      (repo.description || '').toLowerCase().includes(searchTerm);
    const matchesLanguage = language === 'all' || repo.language === language;
    return matchesSearch && matchesLanguage;
  });

  filtered = sortRepos(filtered, sortKey);

  repoGrid.innerHTML = '';

  if (!filtered.length) {
    repoStatus.textContent = 'No other repositories match your filters.';
    return;
  }

  repoStatus.textContent = `${filtered.length} repositories shown.`;

  filtered.forEach((repo) => {
    repoGrid.appendChild(createRepoCard(repo));
  });
}

async function loadRepos() {
  if (!repoStatus || !repoGrid) {
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: {
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub request failed: ${response.status}`);
    }

    const data = await response.json();
    allRepos = data.filter(isInteresting);

    const split = resolveFeatured(allRepos);
    featuredRepos = split.featured;
    otherRepos = split.other;

    updateLanguageOptions(otherRepos);
    renderFeatured();
    renderRepos();
  } catch (error) {
    repoStatus.textContent = 'Unable to load repositories right now. Please check back later.';
    repoGrid.innerHTML = '';
    if (featuredStatus && featuredGrid) {
      featuredStatus.textContent = '';
      featuredGrid.innerHTML = '';
    }
  }
}

if (repoSearch) {
  repoSearch.addEventListener('input', renderRepos);
}

if (repoSort) {
  repoSort.addEventListener('change', renderRepos);
}

if (repoLanguage) {
  repoLanguage.addEventListener('change', renderRepos);
}

document.addEventListener('DOMContentLoaded', loadRepos);
