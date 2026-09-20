import { writable, derived } from 'svelte/store';

function makePlayer(name = '') {
  return {
    name,
    scores: {
      voegel: 0,
      bonusTotal: 0,
      rundenziele: 0,
      eier: 0,
      futter: 0,
      kartenUnterVoegeln: 0,
      nektarMode: 'auto',
      nektarHabitats: { wald: 0, grasland: 0, feuchtgebiet: 0 },
      nektarTotal: 0,
      duettMarker: 0,
    },
  };
}

export const screen = writable('setup');

export const gameState = writable({
  playerCount: 2,
  players: [makePlayer(), makePlayer()],
});

export const isDoubleGame = derived(gameState, ($g) => $g.playerCount === 2);

// Nectar points per player, accounting for habitat rankings across all auto-mode players.
// Players in 'total' mode contribute their nektarTotal directly.
export const nektarPoints = derived(gameState, ($g) => {
  const players = $g.players;
  const habitats = ['wald', 'grasland', 'feuchtgebiet'];

  const points = players.map((p) =>
    p.scores.nektarMode === 'total' ? p.scores.nektarTotal : 0
  );

  for (const habitat of habitats) {
    const autoPlayers = players
      .map((p, i) => ({ i, value: p.scores.nektarHabitats[habitat] }))
      .filter((_, i) => players[i].scores.nektarMode === 'auto');

    if (autoPlayers.length === 0) continue;

    const max = Math.max(...autoPlayers.map((p) => p.value));
    const firstPlaceCount = autoPlayers.filter((p) => p.value === max).length;

    for (const { i, value } of autoPlayers) {
      if (value === max) {
        points[i] += 5;
      } else if (firstPlaceCount === 1) {
        // 2nd-place award only exists when there is a single 1st-place player
        const secondMax = Math.max(...autoPlayers.filter((p) => p.value < max).map((p) => p.value));
        if (isFinite(secondMax) && value === secondMax) points[i] += 2;
      }
    }
  }

  return points;
});

export const playerTotals = derived([gameState, nektarPoints], ([$g, $nk]) =>
  $g.players.map((p, i) => {
    const s = p.scores;
    return s.voegel + s.bonusTotal + s.rundenziele + s.eier + s.futter + s.kartenUnterVoegeln + $nk[i] + s.duettMarker;
  })
);

export const rankedPlayers = derived([gameState, playerTotals, nektarPoints], ([$g, $totals, $nk]) => {
  const sorted = $g.players
    .map((p, i) => ({ ...p, total: $totals[i], nektarPoints: $nk[i], originalIndex: i }))
    .sort((a, b) => b.total - a.total);

  const result = [];
  let rank = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].total < sorted[i - 1].total) {
      rank = i + 1;
    }
    result.push({ ...sorted[i], rank });
  }
  return result;
});

// Actions
export function initGame(playerCount, names) {
  gameState.set({ playerCount, players: names.map((n) => makePlayer(n)) });
  screen.set('score');
}

export function updateScore(playerIndex, field, value) {
  gameState.update((g) => {
    g.players[playerIndex].scores[field] = value;
    return { ...g, players: [...g.players] };
  });
}

export function updateNektarHabitat(playerIndex, habitat, value) {
  gameState.update((g) => {
    g.players[playerIndex].scores.nektarHabitats = {
      ...g.players[playerIndex].scores.nektarHabitats,
      [habitat]: value,
    };
    return { ...g, players: [...g.players] };
  });
}

export function updateNektarMode(playerIndex, mode) {
  gameState.update((g) => {
    g.players[playerIndex].scores.nektarMode = mode;
    return { ...g, players: [...g.players] };
  });
}

export function updateBonusTotal(playerIndex, total) {
  gameState.update((g) => {
    g.players[playerIndex].scores.bonusTotal = total;
    return { ...g, players: [...g.players] };
  });
}

export function goToResults() {
  screen.set('results');
}

export function resetGame() {
  gameState.set({ playerCount: 2, players: [makePlayer(), makePlayer()] });
  screen.set('setup');
}
