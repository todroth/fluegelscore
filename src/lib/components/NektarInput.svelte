<script>
  import { nektarPoints, updateNektarHabitat, updateScore } from '../store.js';

  let { playerIndex, mode, habitatValues, nektarTotalValue } = $props();

  let currentAutoPoints = $derived($nektarPoints[playerIndex] ?? 0);

  function onHabitatInput(habitat, e) {
    const v = Math.max(0, parseInt(e.target.value) || 0);
    updateNektarHabitat(playerIndex, habitat, v);
  }

  function onManualInput(e) {
    updateScore(playerIndex, 'nektarTotal', Math.max(0, parseInt(e.target.value) || 0));
  }
</script>

{#if mode === 'auto'}
  <div class="habitats">
    {#each [{ key: 'wald', label: 'Wald' }, { key: 'grasland', label: 'Gras' }, { key: 'feuchtgebiet', label: 'Feucht' }] as h}
      <div class="habitat-row">
        <span class="habitat-label">{h.label}</span>
        <input
          type="number"
          min="0"
          inputmode="numeric"
          placeholder="0"
          value={habitatValues?.[h.key] || ''}
          oninput={(e) => onHabitatInput(h.key, e)}
          onblur={(e) => { if (!e.target.value) updateNektarHabitat(playerIndex, h.key, 0); }}
        />
      </div>
    {/each}
  </div>
  <div class="points-preview">→ {currentAutoPoints} Pkt.</div>
{:else}
  <input
    type="number"
    min="0"
    inputmode="numeric"
    placeholder="0"
    value={nektarTotalValue || ''}
    oninput={onManualInput}
    onblur={(e) => { if (!e.target.value) updateScore(playerIndex, 'nektarTotal', 0); }}
  />
{/if}

<style>
  .habitats {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    width: 100%;
  }

  .habitat-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .habitat-label {
    font-size: 0.72rem;
    color: var(--color-text-muted);
    width: 2.8rem;
    flex-shrink: 0;
  }

  .habitat-row input {
    flex: 1;
    padding: 0.35rem 0.25rem;
    font-size: 0.9rem;
  }

  .points-preview {
    font-size: 0.8rem;
    color: var(--color-accent);
    font-weight: 600;
    text-align: right;
    margin-top: 0.2rem;
  }
</style>
