<script>
  import { screen } from '../store.js';
  import { loadHistory, deleteEntry, clearHistory } from '../history.js';

  let history = $state(loadHistory());

  function remove(id) {
    deleteEntry(id);
    history = loadHistory();
  }

  function removeAll() {
    if (confirm('Gesamten Spielverlauf löschen?')) {
      clearHistory();
      history = loadHistory();
    }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const RANK_LABELS = ['🥇', '🥈', '🥉'];
</script>

<div class="history-screen">
  <div class="top-bar">
    <button class="back-btn" onclick={() => screen.set('setup')}>
      ← Zurück
    </button>
    <h2>Spielverlauf</h2>
    {#if history.length > 0}
      <button class="clear-btn" onclick={removeAll}>Alle löschen</button>
    {:else}
      <div style="width: 80px"></div>
    {/if}
  </div>

  {#if history.length === 0}
    <div class="empty">
      <p>Noch keine Spiele gespeichert.</p>
      <p class="hint">Spiele werden nach der Auswertung automatisch gespeichert.</p>
    </div>
  {:else}
    <div class="entries">
      {#each history as entry}
        <div class="entry-card">
          <div class="entry-header">
            <span class="date">{formatDate(entry.date)}</span>
            <button class="delete-btn" onclick={() => remove(entry.id)} aria-label="Eintrag löschen">×</button>
          </div>
          <div class="entry-players">
            {#each entry.players as p}
              <div class="entry-player">
                <span class="entry-rank">
                  {p.rank <= 3 ? RANK_LABELS[p.rank - 1] : `${p.rank}.`}
                </span>
                <span class="entry-name">{p.name}</span>
                <span class="entry-pts">{p.total} Pkt.</span>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .history-screen {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  h2 {
    font-size: 1.25rem;
    text-align: center;
    flex: 1;
  }

  .back-btn {
    color: var(--color-accent);
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.35rem 0.5rem;
    border-radius: var(--radius-sm);
    transition: background 0.15s;
    white-space: nowrap;
  }

  .back-btn:hover {
    background: var(--color-bg);
  }

  .clear-btn {
    color: #b44;
    font-size: 0.85rem;
    padding: 0.35rem 0.5rem;
    border-radius: var(--radius-sm);
    border: 1px solid #dbb;
    white-space: nowrap;
    transition: background 0.15s;
  }

  .clear-btn:hover {
    background: #fdf0f0;
  }

  .empty {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--color-text-muted);
  }

  .empty .hint {
    font-size: 0.85rem;
    margin-top: 0.5rem;
    opacity: 0.7;
  }

  .entries {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .entry-card {
    background: var(--color-surface);
    border-radius: var(--radius);
    padding: 0.9rem 1rem;
    box-shadow: var(--shadow);
    border: 1px solid var(--color-border-light);
  }

  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.6rem;
  }

  .date {
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }

  .delete-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    font-size: 1.1rem;
    flex-shrink: 0;
    transition: color 0.15s, background 0.15s;
  }

  .delete-btn:hover {
    background: #fdf0f0;
    color: #b44;
  }

  .entry-players {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .entry-player {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .entry-rank {
    font-size: 1rem;
    flex-shrink: 0;
    width: 1.5rem;
  }

  .entry-name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .entry-pts {
    font-weight: 600;
    color: var(--color-accent);
    flex-shrink: 0;
    font-size: 0.85rem;
  }
</style>
