<script>
  import PCHeader from '$lib/components/pc/PCHeader.svelte';
  import PCFooter from '$lib/components/pc/PCFooter.svelte';
</script>

<div class="pc-layout">
  <PCHeader />
  <main>
    <slot></slot>
  </main>
  <PCFooter />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f9fafb; /* gray-50 */
    color: #1f2937; /* gray-800 */
  }
  
  :global(a) {
    text-decoration: none;
  }
  
  :global(h1, h2, h3, h4, h5, h6) {
    margin-top: 0;
  }
  
  .pc-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
  }
</style>
