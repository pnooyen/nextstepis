<script lang="ts">
  import svelteLogo from '../../assets/svelte.svg'
  import Counter from '../../lib/Counter.svelte'
  import { onMount } from 'svelte';

  onMount(async () => {
    document.getElementById('openEditor').addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.create({url: chrome.runtime.getURL('sidepanel.html')});
});
	});



  document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.log) {
            const logElement = document.createElement('p');
            logElement.textContent = message.log;
            // Clear the existing content of the body
            document.body.innerHTML = '';
            document.body.appendChild(logElement);
        }
    });
});
</script>

<main>
  <div>
    <a href="https://wxt.dev" target="_blank" rel="noreferrer">
      <img src="/wxt.svg" class="logo" alt="WXT Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>WXT + Svelte</h1>
  <a href="#" id="openEditor">Open Editor</a>

  <div class="card">
    <Counter />
  </div>

  <p class="read-the-docs">
    Click on the WXT and Svelte logos to learn more
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #54bc4ae0);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
