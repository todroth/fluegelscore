const STORAGE_KEY = 'fluegelscore_history';

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveGame(rankedPlayers) {
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    players: rankedPlayers.map(({ name, total, rank }) => ({ name, total, rank })),
  };
  const history = [entry, ...loadHistory()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function deleteEntry(id) {
  const history = loadHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
