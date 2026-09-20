<script>
  import { gameState, playerTotals, isDoubleGame, updateScore, setNektarMode, goToResults } from '../store.js';
  import BonusInput from './BonusInput.svelte';
  import NektarInput from './NektarInput.svelte';

  $effect(() => {
    function onBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  });

  let players = $derived($gameState.players);
  let totals = $derived($playerTotals);

  function onInput(playerIndex, field, e) {
    const v = Math.max(0, parseInt(e.target.value) || 0);
    updateScore(playerIndex, field, v);
  }

  function onBlur(playerIndex, field, e) {
    if (!e.target.value) updateScore(playerIndex, field, 0);
  }

  const rowsBefore = [
    { key: 'voegel', label: 'Vögel' },
  ];

  const rowsAfter = [
    { key: 'rundenziele', label: 'Rundenziele' },
    { key: 'eier', label: 'Eier' },
    { key: 'futter', label: 'Gelagertes Futter' },
    { key: 'kartenUnterVoegeln', label: 'Karten unter Vögeln' },
  ];
</script>

<div class="score-screen">
  <div class="scroll-container">
    <div class="grid" style="--players: {players.length}">

      <!-- Player name header -->
      <div class="cell label-cell header-cell"></div>
      {#each players as p}
        <div class="cell player-header">{p.name}</div>
      {/each}

      <!-- Vögel row -->
      {#each rowsBefore as row}
        <div class="cell label-cell">{row.label}</div>
        {#each players as p, i}
          <div class="cell input-cell">
            <input
              type="number"
              min="0"
              inputmode="numeric"
              placeholder="0"
              value={p.scores[row.key] || ''}
              oninput={(e) => onInput(i, row.key, e)}
              onblur={(e) => onBlur(i, row.key, e)}
            />
          </div>
        {/each}
      {/each}

      <!-- Bonuskarten row -->
      <div class="cell label-cell">Bonuskarten</div>
      {#each players as p, i}
        <div class="cell input-cell">
          <BonusInput playerIndex={i} value={p.scores.bonusTotal} />
        </div>
      {/each}

      <!-- Remaining simple rows -->
      {#each rowsAfter as row}
        <div class="cell label-cell">{row.label}</div>
        {#each players as p, i}
          <div class="cell input-cell">
            <input
              type="number"
              min="0"
              inputmode="numeric"
              placeholder="0"
              value={p.scores[row.key] || ''}
              oninput={(e) => onInput(i, row.key, e)}
              onblur={(e) => onBlur(i, row.key, e)}
            />
          </div>
        {/each}
      {/each}

      <!-- Nektar row with global mode toggle -->
      <div class="cell label-cell nektar-label-cell">
        <span>Nektar</span>
        <div class="nektar-toggle">
          <button class:active={$gameState.nektarMode === 'auto'} onclick={() => setNektarMode('auto')}>Auto</button>
          <button class:active={$gameState.nektarMode === 'total'} onclick={() => setNektarMode('total')}>Manuell</button>
        </div>
      </div>
      {#each players as p, i}
        <div class="cell input-cell">
          <NektarInput
            playerIndex={i}
            mode={$gameState.nektarMode}
            habitatValues={p.scores.nektarHabitats}
            nektarTotalValue={p.scores.nektarTotal}
          />
        </div>
      {/each}

      <!-- Duett-Marker row (2-player only) -->
      {#if $isDoubleGame}
        <div class="cell label-cell">Duett-Marker</div>
        {#each players as p, i}
          <div class="cell input-cell">
            <input
              type="number"
              min="0"
              inputmode="numeric"
              placeholder="0"
              value={p.scores.duettMarker || ''}
              oninput={(e) => onInput(i, 'duettMarker', e)}
              onblur={(e) => onBlur(i, 'duettMarker', e)}
            />
          </div>
        {/each}
      {/if}

      <!-- Total row -->
      <div class="cell label-cell total-label">Gesamt</div>
      {#each totals as t}
        <div class="cell total-cell">{t}</div>
      {/each}

    </div>
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

  .scroll-container {
    overflow-x: auto;
    overflow-y: clip;
    -webkit-overflow-scrolling: touch;
    background: var(--color-surface);
    border-radius: var(--radius);
    border: 1px solid var(--color-border-light);
    box-shadow: var(--shadow);
  }

  .grid {
    display: grid;
    grid-template-columns: 6.5rem repeat(var(--players), minmax(6rem, 1fr));
    min-width: fit-content;
    width: 100%;
  }

  .cell {
    padding: 0.55rem 0.5rem;
    border-bottom: 1px solid var(--color-border-light);
    display: flex;
    align-items: flex-start;
  }

  /* Sticky label column */
  .label-cell {
    position: sticky;
    left: 0;
    background: var(--color-surface-raised);
    z-index: 1;
    font-size: 0.8rem;
    color: var(--color-text-muted);
    line-height: 1.3;
    align-items: center;
    border-right: 1px solid var(--color-border-light);
    padding-right: 0.6rem;
  }

  .header-cell {
    top: 0;
    z-index: 3;
    border-bottom: 2px solid var(--color-border);
  }

  .player-header {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--color-surface);
    font-family: var(--font-serif);
    font-size: 0.95rem;
    color: var(--color-text);
    justify-content: center;
    text-align: center;
    border-bottom: 2px solid var(--color-border);
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    padding: 0.55rem 0.4rem;
  }

  .input-cell {
    flex-direction: column;
    justify-content: flex-start;
    padding: 0.4rem 0.4rem;
  }

  .input-cell :global(input[type="number"]) {
    width: 100%;
    padding: 0.45rem 0.25rem;
    font-size: 1rem;
    text-align: center;
  }

  .total-label {
    font-family: var(--font-serif);
    font-weight: 600;
    color: var(--color-text);
    border-bottom: none;
    border-top: 2px solid var(--color-border);
  }

  .total-cell {
    justify-content: center;
    font-family: var(--font-serif);
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-accent);
    border-bottom: none;
    border-top: 2px solid var(--color-border);
    text-align: center;
    display: block;
    padding: 0.55rem 0.4rem;
  }

  .nektar-label-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }

  .nektar-toggle {
    display: flex;
    width: 100%;
    border: 1px solid var(--color-border-light);
    border-radius: 4px;
    overflow: hidden;
  }

  .nektar-toggle button {
    flex: 1;
    padding: 0.2rem 0;
    font-size: 0.68rem;
    font-weight: 500;
    color: var(--color-text-muted);
    background: var(--color-bg);
    transition: background 0.15s, color 0.15s;
  }

  .nektar-toggle button.active {
    background: var(--color-accent);
    color: white;
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
