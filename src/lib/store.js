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
      nektarHabitats: { wald: 0, grasland: 0, feuchtgebiet: 0 },
      nektarTotal: 0,
      duettMarker: 0,
    },
  };
}

// Standard Wingspan tie-breaking: combine points for tied positions, divide, round down.
// posPoints = [5, 2] → 1st place = 5 pts, 2nd place = 2 pts, 3rd+ = 0
function awardHabitat(values) {
  const max = Math.max(...values);
  if (max === 0) return values.map(() => 0);

  const posPoints = [5, 2];
  const sorted = [...values].sort((a, b) => b - a);

  return values.map((v) => {
    if (v === 0) return 0;
    const rank = sorted.indexOf(v);
    const tiedCount = sorted.filter((s) => s === v).length;
    let combined = 0;
    for (let p = rank; p < rank + tiedCount; p++) {
      combined += posPoints[p] ?? 0;
    }
    return Math.floor(combined / tiedCount);
  });
}

export const screen = writable('setup');

export const gameState = writable({
  playerCount: 2,
  nektarMode: 'auto', // global — all players use the same mode
  players: [makePlayer(), makePlayer()],
});

export const isDoubleGame = derived(gameState, ($g) => $g.playerCount === 2);

// Nectar points per player.
// 'auto': rank all players by habitat values using Wingspan tie-breaking.
// 'total': each player's nektarTotal is used directly.
export const nektarPoints = derived(gameState, ($g) => {
  if ($g.nektarMode === 'total') {
    return $g.players.map((p) => p.scores.nektarTotal);
  }

  const habitats = ['wald', 'grasland', 'feuchtgebiet'];
  const points = $g.players.map(() => 0);

  for (const habitat of habitats) {
    const values = $g.players.map((p) => p.scores.nektarHabitats[habitat]);
    const awards = awardHabitat(values);
    awards.forEach((pts, i) => { points[i] += pts; });
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
  gameState.set({ playerCount, nektarMode: 'auto', players: names.map((n) => makePlayer(n)) });
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

export function setNektarMode(mode) {
  gameState.update((g) => {
    // When switching to 'total', pre-fill each player's nektarTotal
    // with their currently calculated auto-points so nothing is lost.
    if (mode === 'total') {
      const habitats = ['wald', 'grasland', 'feuchtgebiet'];
      const autoPoints = g.players.map(() => 0);
      for (const habitat of habitats) {
        const values = g.players.map((p) => p.scores.nektarHabitats[habitat]);
        const awards = awardHabitat(values);
        awards.forEach((pts, i) => { autoPoints[i] += pts; });
      }
      const players = g.players.map((p, i) => ({
        ...p,
        scores: { ...p.scores, nektarTotal: autoPoints[i] },
      }));
      return { ...g, nektarMode: mode, players };
    }
    return { ...g, nektarMode: mode };
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
  gameState.set({ playerCount: 2, nektarMode: 'auto', players: [makePlayer(), makePlayer()] });
  screen.set('setup');
}
