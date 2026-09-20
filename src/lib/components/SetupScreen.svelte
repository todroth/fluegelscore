<script>
  import { screen, initGame } from '../store.js';

  let playerCount = $state(2);
  let names = $state(['Luise', 'Tobi']);

  function setCount(n) {
    playerCount = n;
    if (names.length < n) {
      names = [...names, ...Array(n - names.length).fill('')];
    } else {
      names = names.slice(0, n);
    }
  }

  function start() {
    const finalNames = names.map((n, i) => n.trim() || `Spieler ${i + 1}`);
    initGame(playerCount, finalNames);
  }

  function goToHistory() {
    screen.set('history');
  }
</script>

<div class="setup">
  <div class="section">
    <p class="label">Spieleranzahl</p>
    <div class="count-pills">
      {#each [2, 3, 4, 5] as n}
        <button
          class="pill"
          class:active={playerCount === n}
          onclick={() => setCount(n)}
          aria-pressed={playerCount === n}
        >{n}</button>
      {/each}
    </div>
  </div>

  <div class="section">
    <p class="label">Spielernamen</p>
    <div class="name-inputs">
      {#each names as _, i}
        <div class="name-row">
          <span class="name-num">{i + 1}</span>
          <input
            type="text"
            placeholder="Spieler {i + 1}"
            bind:value={names[i]}
            maxlength="30"
            autocomplete="off"
            onkeydown={(e) => e.key === 'Enter' && start()}
          />
        </div>
      {/each}
    </div>
  </div>

  <button class="btn-primary" onclick={start}>
    Spiel auswerten
  </button>

  <button class="btn-secondary" onclick={goToHistory}>
    Spielverlauf anzeigen
  </button>
</div>

<style>
  .setup {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    max-width: 400px;
    margin: 0 auto;
    padding-top: 0.5rem;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .label {
    font-family: var(--font-serif);
    font-size: 1rem;
    color: var(--color-text-muted);
    letter-spacing: 0.02em;
  }

  .count-pills {
    display: flex;
    gap: 0.5rem;
  }

  .pill {
    flex: 1;
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 1.1rem;
    font-weight: 500;
    transition: all 0.15s;
  }

  .pill:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .pill.active {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: white;
    box-shadow: 0 2px 6px rgba(90, 122, 101, 0.35);
  }

  .name-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .name-num {
    font-family: var(--font-serif);
    font-size: 1rem;
    color: var(--color-text-muted);
    width: 1.2rem;
    text-align: right;
    flex-shrink: 0;
  }

  .btn-primary {
    width: 100%;
    padding: 0.9rem 1rem;
    background: var(--color-accent);
    color: white;
    border-radius: var(--radius);
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    box-shadow: 0 2px 8px rgba(90, 122, 101, 0.3);
    transition: background 0.15s, box-shadow 0.15s;
  }

  .btn-primary:hover {
    background: #4a6a55;
    box-shadow: 0 4px 12px rgba(90, 122, 101, 0.4);
  }

  .btn-secondary {
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    color: var(--color-text-muted);
    border-radius: var(--radius);
    border: 1.5px solid var(--color-border);
    font-size: 0.95rem;
    transition: border-color 0.15s, color 0.15s;
  }

  .btn-secondary:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
</style>
