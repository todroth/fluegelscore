const STORAGE_KEY = 'fluegelscore_history';

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

// Upserts by game id, so re-visiting the results screen (e.g. after correcting a score)
// updates the existing entry instead of creating a duplicate.
export function saveGame(rankedPlayers, id = Date.now()) {
  const history = loadHistory();
  const existing = history.find((e) => e.id === id);
  const entry = {
    id,
    date: existing?.date ?? new Date().toISOString(),
    players: rankedPlayers.map(({ name, total, rank }) => ({ name, total, rank })),
  };
  const updated = existing ? history.map((e) => (e.id === id ? entry : e)) : [entry, ...history];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteEntry(id) {
  const history = loadHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
