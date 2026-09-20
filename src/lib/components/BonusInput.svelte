<script>
  import { updateBonusTotal } from '../store.js';

  let { playerIndex } = $props();

  let cardValues = $state([0]);

  function getCardSum() {
    return cardValues.reduce((a, b) => a + (Number(b) || 0), 0);
  }

  let cardSum = $derived(getCardSum());

  function addCard() {
    cardValues = [...cardValues, 0];
    updateBonusTotal(playerIndex, getCardSum());
  }

  function removeCard(i) {
    cardValues = cardValues.filter((_, idx) => idx !== i);
    updateBonusTotal(playerIndex, getCardSum());
  }

  function onCardInput(i, e) {
    const v = Math.max(0, parseInt(e.target.value) || 0);
    cardValues = cardValues.map((c, idx) => (idx === i ? v : c));
    updateBonusTotal(playerIndex, getCardSum());
  }
</script>

<div class="bonus-input">
  <div class="cards-list">
    {#each cardValues as _, i}
      <div class="card-row">
        <input
          type="number"
          min="0"
          inputmode="numeric"
          placeholder="0"
          value={cardValues[i] || ''}
          oninput={(e) => onCardInput(i, e)}
          onblur={(e) => { if (!e.target.value) onCardInput(i, { target: { value: '0' } }); }}
        />
        {#if i > 0}
          <button class="remove-btn" onclick={() => removeCard(i)} aria-label="Karte entfernen">×</button>
        {/if}
      </div>
    {/each}
    <button class="add-btn" onclick={addCard}>+ Karte</button>
  </div>
  {#if cardValues.length > 1}
    <div class="sum-preview">= {cardSum}</div>
  {/if}
</div>

<style>
  .bonus-input {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .cards-list {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .card-row {
    display: flex;
    gap: 0.35rem;
    align-items: center;
  }

  .card-row input {
    flex: 1;
  }

  .remove-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    font-size: 1.1rem;
    line-height: 1;
    flex-shrink: 0;
    transition: color 0.15s, background 0.15s;
  }

  .remove-btn:hover {
    background: #f5e0e0;
    color: #b44;
  }

  .add-btn {
    align-self: flex-start;
    padding: 0.3rem 0.7rem;
    border-radius: var(--radius-sm);
    border: 1.5px dashed var(--color-border);
    color: var(--color-accent);
    font-size: 0.85rem;
    font-weight: 500;
    transition: border-color 0.15s, background 0.15s;
  }

  .add-btn:hover {
    background: var(--color-bg);
    border-color: var(--color-accent);
  }

  .sum-preview {
    text-align: right;
    font-size: 0.85rem;
    color: var(--color-text-muted);
    font-weight: 500;
  }
</style>
