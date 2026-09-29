<script>
  import { updateKolibriTrack } from '../store.js';

  let { playerIndex, tracks, total } = $props();

  // Aufgedruckte Punktwerte der Kolibri-Punktetafel
  const VALUES = [10, 8, 6, 4, 3, 2, 1, 0, -3];
</script>

<div class="tracks">
  {#each tracks as t, i}
    <div class="track-row">
      <span class="track-num">{i + 1}</span>
      <select
        value={t}
        onchange={(e) => updateKolibriTrack(playerIndex, i, e.target.value)}
        aria-label="Kolibri-Spalte {i + 1}"
      >
        {#each VALUES as v}
          <option value={String(v)}>{v}</option>
        {/each}
      </select>
    </div>
  {/each}
</div>
<div class="points-preview">→ {total} Pkt.</div>

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
    font-size: 0.75rem;
    width: 1.2rem;
    flex-shrink: 0;
    text-align: center;
    color: var(--color-text-muted);
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
