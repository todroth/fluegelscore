<script>
  import { nektarPoints, updateNektarHabitat, updateNektarMode, updateScore } from '../store.js';

  let { playerIndex, habitatValues, nektarModeValue, nektarTotalValue } = $props();

  let mode = $state(nektarModeValue ?? 'auto');
  let manualTotal = $state(nektarTotalValue ?? 0);

  let currentAutoPoints = $derived($nektarPoints[playerIndex] ?? 0);

  function switchToAuto() {
    mode = 'auto';
    updateNektarMode(playerIndex, 'auto');
  }

  function switchToTotal() {
    manualTotal = currentAutoPoints;
    mode = 'total';
    updateNektarMode(playerIndex, 'total');
    updateScore(playerIndex, 'nektarTotal', manualTotal);
  }

  function onHabitatInput(habitat, e) {
    const v = Math.max(0, parseInt(e.target.value) || 0);
    updateNektarHabitat(playerIndex, habitat, v);
  }

  function onManualInput(e) {
    manualTotal = Math.max(0, parseInt(e.target.value) || 0);
    updateScore(playerIndex, 'nektarTotal', manualTotal);
  }

</script>

<div class="nektar-input">
  <div class="mode-toggle">
    <button class:active={mode === 'auto'} onclick={switchToAuto}>Auto</button>
    <button class:active={mode === 'total'} onclick={switchToTotal}>Manuell</button>
  </div>

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
            value={habitatValues?.[h.key] ?? 0}
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
      value={manualTotal}
      oninput={onManualInput}
      onblur={(e) => { if (!e.target.value) { manualTotal = 0; updateScore(playerIndex, 'nektarTotal', 0); } }}
    />
  {/if}
</div>

<style>
  .nektar-input {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .mode-toggle {
    display: flex;
    background: var(--color-bg);
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--color-border-light);
    overflow: hidden;
  }

  .mode-toggle button {
    flex: 1;
    padding: 0.3rem 0.5rem;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--color-text-muted);
    transition: background 0.15s, color 0.15s;
    border-right: 1px solid var(--color-border-light);
  }

  .mode-toggle button:last-child {
    border-right: none;
  }

  .mode-toggle button.active {
    background: var(--color-accent);
    color: white;
  }

  .habitats {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .habitat-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .habitat-label {
    font-size: 0.78rem;
    color: var(--color-text-muted);
    width: 3.5rem;
    flex-shrink: 0;
  }

  .habitat-row input {
    flex: 1;
    padding: 0.35rem 0.5rem;
    font-size: 0.95rem;
  }

  .points-preview {
    text-align: right;
    font-size: 0.85rem;
    color: var(--color-accent);
    font-weight: 600;
  }
</style>
