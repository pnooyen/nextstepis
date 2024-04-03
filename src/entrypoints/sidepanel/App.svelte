<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  // let lAppState = "IDLE";
  // let lRecordingStep = [];
  // let lUserPreferences = {};

  let appState: any = {};

  const unwatchaAplicationState = storage.watch<any>(
    "local:applicationState",
    (newState, oldState) => {
      appState = newState;
      // console.log(newState);
      // lAppState = newState?.appState || "IDLE";
      // lRecordingStep = newState?.recordingStep || [];
      // lUserPreferences = newState?.userPreferences || {};
    }
  );

  onMount(async () => {
    const applicationState = await storage.getItem("local:applicationState");
    appState = applicationState
    console.log(appState)
    // appState.state = "IDLE"
    // appState.state = "IDLE";
  });

  onDestroy(async () => {
    // unwatchaAplicationState();
  });

  async function toggleCapture() {
    // capturing.update((n) => !n); // Toggle the state
    // You still need to send a message to the background script to update other parts of the extension
    if(appState?.state === 'IDLE'){
      await storage.setItem("local:applicationState", { state: "RECORDING" });
      // call start recording
    }else{
      await storage.setItem("local:applicationState", { state: "IDLE" });
      // call end recording
    }
    // chrome.runtime.sendMessage({ action: "toggleCapturing" });
  }

  // onMount(async () => {
  //   document
  //     .getElementById("openEditor")
  //     .addEventListener("click", function (e) {
  //       e.preventDefault();
  //       chrome.tabs.create({ url: chrome.runtime.getURL("sidepanel.html") });
  //     });
  // });

  // document.addEventListener("DOMContentLoaded", function () {
  //   chrome.runtime.onMessage.addListener(
  //     function (message, sender, sendResponse) {
  //       if (message.log) {
  //         const logElement = document.createElement("p");
  //         logElement.textContent = message.log;
  //         // Clear the existing content of the body
  //         document.body.innerHTML = "";
  //         document.body.appendChild(logElement);
  //       }
  //     }
  //   );
  // });
</script>

<!-- {appState?.state} -->
<div class="flex flex-col items-center justify-center p-4 bg-gray-100 h-full">
  <button
    class="{appState?.state === "RECORDING"
      ? 'bg-red-500 hover:bg-red-700'
      : 'bg-blue-500 hover:bg-blue-700'} px-4 py-2 text-white font-bold rounded transition duration-150 ease-in-out"
    on:click={toggleCapture}
  >
    {appState?.state === "RECORDING" ? "End Capture" : "Start Capture"}
  </button>
  <!-- <p class="mt-4 text-lg">{lAppState ? "Capturing..." : "Idle"}</p> -->
</div>

<!-- <main>
  <div>
    <a href="https://wxt.dev" target="_blank" rel="noreferrer">
      <img src="/wxt.svg" class="logo" alt="WXT Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>WXT + Svelte</h1>
  <h1 class="text-3xl font-bold underline">WXT + Svelte</h1>
  <a href="#" id="openEditor">Open Editor</a>

  <div class="card">
    <Counter />
  </div>

  <p class="read-the-docs">Click on the WXT and Svelte logos to learn more</p>
</main> -->
<!-- 
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
</style> -->
