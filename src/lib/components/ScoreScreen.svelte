<script>
  import { gameState, goToResults } from '../store.js';
  import PlayerColumn from './PlayerColumn.svelte';

  let activePlayer = $state(0);

  let players = $derived($gameState.players);
</script>

<div class="score-screen">
  <div class="player-tabs" role="tablist">
    {#each players as p, i}
      <button
        role="tab"
        class:active={activePlayer === i}
        aria-selected={activePlayer === i}
        onclick={() => (activePlayer = i)}
      >
        {p.name}
      </button>
    {/each}
  </div>

  <div class="player-card">
    {#key activePlayer}
      <PlayerColumn playerIndex={activePlayer} />
    {/key}
  </div>

  <button class="btn-results" onclick={goToResults}>
    Ergebnis anzeigen
  </button>
</div>

<style>
  .score-screen {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .player-tabs {
    display: flex;
    gap: 0.35rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    scrollbar-width: none;
  }

  .player-tabs::-webkit-scrollbar {
    display: none;
  }

  .player-tabs button {
    flex-shrink: 0;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-muted);
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
    transition: all 0.15s;
  }

  .player-tabs button.active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: white;
    box-shadow: 0 2px 6px rgba(90, 122, 101, 0.35);
  }

  .player-card {
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: 1rem;
    box-shadow: var(--shadow);
    border: 1px solid var(--color-border-light);
  }

  .btn-results {
    width: 100%;
    padding: 0.9rem 1rem;
    background: var(--color-text);
    color: var(--color-bg);
    border-radius: var(--radius);
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    box-shadow: var(--shadow-md);
    transition: background 0.15s;
  }

  .btn-results:hover {
    background: #1a140d;
  }
</style>
