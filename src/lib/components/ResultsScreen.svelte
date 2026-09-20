<script>
  import { rankedPlayers, isDoubleGame, resetGame } from '../store.js';
  import { saveGame } from '../history.js';

  function newGame() {
    saveGame($rankedPlayers);
    resetGame();
  }

  const RANK_LABELS = ['🥇', '🥈', '🥉'];

  const SCORE_LABELS = {
    voegel: 'Vögel',
    bonusTotal: 'Bonuskarten',
    rundenziele: 'Rundenziele',
    eier: 'Eier',
    futter: 'Gelagertes Futter',
    kartenUnterVoegeln: 'Karten unter Vögeln',
    nektarPoints: 'Nektar',
    duettMarker: 'Duett-Marker',
  };
</script>

<div class="results">
  <h2>Ergebnis</h2>

  <div class="players">
    {#each $rankedPlayers as p, idx}
      <div class="player-card" class:winner={p.rank === 1}>
        <div class="player-header">
          <span class="rank">
            {#if p.rank <= 3}
              {RANK_LABELS[p.rank - 1]}
            {:else}
              {p.rank}.
            {/if}
          </span>
          <span class="name">{p.name}</span>
          <span class="total">{p.total}</span>
        </div>

        <table class="breakdown">
          <tbody>
            {#each Object.entries(SCORE_LABELS) as [key, label]}
              {#if key !== 'duettMarker' || $isDoubleGame}
                {@const val = key === 'nektarPoints' ? p.nektarPoints : p.scores[key]}
                {#if val > 0}
                  <tr>
                    <td>{label}</td>
                    <td class="pts">{val}</td>
                  </tr>
                {/if}
              {/if}
            {/each}
          </tbody>
        </table>
      </div>
    {/each}
  </div>

  <button class="btn-new" onclick={newGame}>Neue Runde</button>
</div>

<style>
  .results {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  h2 {
    font-size: 1.6rem;
    color: var(--color-text);
    text-align: center;
  }

  .players {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .player-card {
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: 1rem;
    box-shadow: var(--shadow);
    border: 1.5px solid var(--color-border-light);
  }

  .player-card.winner {
    border-color: var(--color-gold);
    background: var(--color-gold-light);
    box-shadow: 0 4px 16px rgba(196, 154, 60, 0.2);
  }

  .player-header {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    margin-bottom: 0.75rem;
  }

  .rank {
    font-size: 1.3rem;
    flex-shrink: 0;
  }

  .name {
    font-family: var(--font-serif);
    font-size: 1.15rem;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .total {
    font-family: var(--font-serif);
    font-size: 1.7rem;
    font-weight: 600;
    color: var(--color-accent);
    flex-shrink: 0;
  }

  .winner .total {
    color: var(--color-gold);
  }

  .breakdown {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .breakdown tr {
    border-top: 1px solid var(--color-border-light);
  }

  .breakdown td {
    padding: 0.3rem 0.1rem;
  }

  .breakdown .pts {
    text-align: right;
    font-weight: 600;
    color: var(--color-text);
    padding-left: 0.5rem;
    white-space: nowrap;
  }

  .btn-new {
    width: 100%;
    padding: 0.9rem 1rem;
    background: var(--color-accent);
    color: white;
    border-radius: var(--radius);
    font-size: 1.05rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(90, 122, 101, 0.3);
    transition: background 0.15s;
  }

  .btn-new:hover {
    background: #4a6a55;
  }
</style>
