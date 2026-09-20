<script>
  import { screen } from './lib/store.js';
  import FeatherIcon from './lib/components/FeatherIcon.svelte';
  import SetupScreen from './lib/components/SetupScreen.svelte';
  import ScoreScreen from './lib/components/ScoreScreen.svelte';
  import ResultsScreen from './lib/components/ResultsScreen.svelte';
  import HistoryScreen from './lib/components/HistoryScreen.svelte';
</script>

<div class="app-shell">
  <header>
    <div class="header-inner">
      <span class="logo-icon"><FeatherIcon size={28} /></span>
      <h1>Flügelscore</h1>
      {#if $screen === 'setup'}
        <button class="history-btn" onclick={() => screen.set('history')} title="Spielverlauf">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </button>
      {:else}
        <div class="header-spacer"></div>
      {/if}
    </div>
  </header>

  <main>
    {#if $screen === 'setup'}
      <SetupScreen />
    {:else if $screen === 'score'}
      <ScoreScreen />
    {:else if $screen === 'results'}
      <ResultsScreen />
    {:else if $screen === 'history'}
      <HistoryScreen />
    {/if}
  </main>
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  header {
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border-light);
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: var(--shadow);
  }

  .header-inner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }

  .logo-icon {
    color: var(--color-accent);
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  h1 {
    font-size: 1.3rem;
    color: var(--color-text);
    flex: 1;
  }


  .history-btn {
    color: var(--color-text-muted);
    display: flex;
    align-items: center;
    padding: 0.35rem;
    border-radius: var(--radius-sm);
    transition: color 0.15s, background 0.15s;
  }

  .history-btn:hover {
    color: var(--color-accent);
    background: var(--color-bg);
  }

  .header-spacer {
    width: 36px;
  }

  main {
    flex: 1;
    padding: 1.25rem 1rem 2rem;
  }
</style>
