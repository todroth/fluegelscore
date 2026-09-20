<script>
  import { gameState, playerTotals, isDoubleGame, updateScore } from '../store.js';
  import BonusInput from './BonusInput.svelte';
  import NektarInput from './NektarInput.svelte';

  let { playerIndex } = $props();

  let player = $derived($gameState.players[playerIndex]);
  let scores = $derived(player.scores);
  let total = $derived($playerTotals[playerIndex] ?? 0);

  function onInput(field, e) {
    const v = Math.max(0, parseInt(e.target.value) || 0);
    updateScore(playerIndex, field, v);
  }

  function onBlur(field, e) {
    if (!e.target.value) updateScore(playerIndex, field, 0);
  }

  const simpleRows = [
    { key: 'voegel', label: 'Vögel' },
    { key: 'rundenziele', label: 'Rundenziele' },
    { key: 'eier', label: 'Eier' },
    { key: 'futter', label: 'Gelagertes Futter' },
    { key: 'kartenUnterVoegeln', label: 'Karten unter Vögeln' },
  ];
</script>

<div class="player-col">
  <div class="rows">
    {#each simpleRows as row}
      <div class="score-row">
        <span class="row-label">{row.label}</span>
        <input
          type="number"
          min="0"
          inputmode="numeric"
          placeholder="0"
          value={scores[row.key] || ''}
          oninput={(e) => onInput(row.key, e)}
          onblur={(e) => onBlur(row.key, e)}
        />
      </div>
    {/each}

    <div class="score-row bonus-row">
      <span class="row-label">Bonuskarten</span>
      <div class="sub-input">
        <BonusInput {playerIndex} value={scores.bonusTotal} />
      </div>
    </div>

    <div class="score-row nektar-row">
      <span class="row-label">Nektar</span>
      <div class="sub-input">
        <NektarInput
          {playerIndex}
          habitatValues={scores.nektarHabitats}
          nektarModeValue={scores.nektarMode}
          nektarTotalValue={scores.nektarTotal}
        />
      </div>
    </div>

    {#if $isDoubleGame}
      <div class="score-row">
        <span class="row-label">Duett-Marker</span>
        <input
          type="number"
          min="0"
          inputmode="numeric"
          placeholder="0"
          value={scores.duettMarker || ''}
          oninput={(e) => onInput('duettMarker', e)}
          onblur={(e) => onBlur('duettMarker', e)}
        />
      </div>
    {/if}
  </div>

  <div class="total-bar">
    <span>Gesamt</span>
    <strong>{total}</strong>
  </div>
</div>

<style>
  .player-col {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .rows {
    display: flex;
    flex-direction: column;
  }

  .score-row {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.7rem 0;
    border-bottom: 1px solid var(--color-border-light);
  }

  .score-row:last-child {
    border-bottom: none;
  }

  .row-label {
    font-size: 0.9rem;
    color: var(--color-text);
    flex: 1;
    min-width: 0;
    padding-top: 0.3rem;
    line-height: 1.3;
  }

  .score-row input {
    width: 5rem;
    flex-shrink: 0;
  }

  .sub-input {
    width: 9rem;
    flex-shrink: 0;
  }

  .total-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--color-accent);
    color: white;
    border-radius: var(--radius-sm);
    font-size: 1rem;
  }

  .total-bar strong {
    font-size: 1.4rem;
    font-family: var(--font-serif);
  }
</style>
