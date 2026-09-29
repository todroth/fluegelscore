<script>
  import { updateKolibriTrack, updateScore } from '../store.js';

  let { playerIndex, mode, tracks, total, kolibriTotalValue } = $props();

  // Manual total may be negative (tracks start at -3 each).
  function onManualInput(e) {
    const v = parseInt(e.target.value);
    updateScore(playerIndex, 'kolibriTotal', Number.isNaN(v) ? 0 : v);
  }

  // Aufgedruckte Punktwerte der Kolibri-Punktetafel
  // Spalten der Tafel (Kolibri-Gruppen)
  const COLUMNS = [
    { icon: '🐝', name: 'Bienen & Bergjuwelen' },
    { icon: '💎', name: 'Brillanten & Koketten' },
    { icon: '💚', name: 'Smaragde' },
    { icon: '🥭', name: 'Mangos' },
    { icon: '🔶', name: 'Topas, Jakobiner & Eremiten' },
  ];
  const VALUES = [10, 8, 6, 4, 3, 2, 1, 0, -3];
</script>

{#if mode === 'auto'}
<div class="tracks">
  {#each tracks as t, i}
    <div class="track-row">
      <span class="track-num" title={COLUMNS[i].name}>{COLUMNS[i].icon}</span>
      <select
        value={t}
        onchange={(e) => updateKolibriTrack(playerIndex, i, e.target.value)}
        aria-label={COLUMNS[i].name}
      >
        {#each VALUES as v}
          <option value={String(v)}>{v}</option>
        {/each}
      </select>
    </div>
  {/each}
</div>
<div class="points-preview">→ {total} Pkt.</div>
{:else}
  <input
    type="number"
    inputmode="text"
    placeholder="0"
    value={kolibriTotalValue || ''}
    oninput={onManualInput}
    onblur={(e) => { if (!e.target.value) updateScore(playerIndex, 'kolibriTotal', 0); }}
  />
{/if}

<style>
  .tracks {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    width: 100%;
  }

  .track-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .track-num {
    font-size: 0.9rem;
    width: 1.2rem;
    flex-shrink: 0;
    text-align: center;
    line-height: 1;
  }

  select {
    flex: 1;
    min-width: 0;
    padding: 0.35rem 0.25rem;
    font-size: 0.9rem;
    text-align: center;
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-text);
  }

  .points-preview {
    font-size: 0.8rem;
    color: var(--color-accent);
    font-weight: 600;
    text-align: right;
    margin-top: 0.2rem;
  }
</style>
