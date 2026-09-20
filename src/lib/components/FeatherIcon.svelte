<script>
  let { size = 32 } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
  <!-- Feather vane -->
  <path d="M16 3
           C19.5 4.5, 23 10, 22.5 17
           C22 22, 19 25.5, 16 25.5
           C13 25.5, 10 22, 9.5 17
           C9 10, 12.5 4.5, 16 3Z"
        fill="currentColor"/>
  <!-- Rachis -->
  <line x1="16" y1="3" x2="16" y2="25.5"
        stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
  <!-- Calamus -->
  <line x1="16" y1="25.5" x2="16" y2="30"
        stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.75"/>
  <!-- Barbs -->
  <path d="M16.5 10 C18.5 11 21 12 22 12.5" stroke="currentColor" stroke-width="0.7" stroke-linecap="round" opacity="0.35"/>
  <path d="M15.5 10 C13.5 11 11 12 10 12.5" stroke="currentColor" stroke-width="0.7" stroke-linecap="round" opacity="0.35"/>
  <path d="M16.3 17 C18.5 18.2 21 19.5 22 20" stroke="currentColor" stroke-width="0.7" stroke-linecap="round" opacity="0.35"/>
  <path d="M15.7 17 C13.5 18.2 11 19.5 10 20" stroke="currentColor" stroke-width="0.7" stroke-linecap="round" opacity="0.35"/>
</svg>
