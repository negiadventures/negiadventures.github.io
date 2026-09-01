// Leaderboard Module - Reusable for all games
const Leaderboard = {
  STORAGE_KEY_PREFIX: 'gameHubLeaderboard_',
  MAX_PLAYERS: 10,

  // Get leaderboard for a specific game
  get: function(gameName) {
    const data = localStorage.getItem(this.STORAGE_KEY_PREFIX + gameName);
    return data ? JSON.parse(data) : [];
  },

  // Save leaderboard for a specific game
  save: function(gameName, scores) {
    localStorage.setItem(this.STORAGE_KEY_PREFIX + gameName, JSON.stringify(scores));
  },

  // Add a new score and return updated top 10
  addScore: function(gameName, playerName, score) {
    const scores = this.get(gameName);
    const newEntry = {
      name: playerName.trim(),
      score: score,
      date: new Date().toLocaleDateString()
    };

    scores.push(newEntry);
    scores.sort((a, b) => b.score - a.score);
    scores.splice(this.MAX_PLAYERS); // Keep only top 10

    this.save(gameName, scores);
    return scores;
  },

  // Render leaderboard as HTML
  render: function(gameName) {
    const scores = this.get(gameName);
    if (scores.length === 0) {
      return '<p style="color: #888; text-align: center;">No scores yet. Be the first!</p>';
    }

    let html = '<table style="width: 100%; color: #fff;">';
    html += '<tr style="border-bottom: 1px solid #444;"><th>#</th><th>Player</th><th>Score</th><th>Date</th></tr>';

    scores.forEach((entry, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
      html += `<tr style="border-bottom: 1px solid #333;">
        <td>${medal} ${index + 1}</td>
        <td>${entry.name}</td>
        <td style="color: #00d4ff; font-weight: bold;">${entry.score}</td>
        <td style="color: #888;">${entry.date}</td>
      </tr>`;
    });

    html += '</table>';
    return html;
  },

  // Clear all scores for a game
  clear: function(gameName) {
    this.save(gameName, []);
  },

  // Clear all leaderboards (for testing)
  clearAll: function() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};
