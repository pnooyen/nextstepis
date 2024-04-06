<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  // let lAppState = "IDLE";
  // let lRecordingStep = [];
  // let lUserPreferences = {};

  // let appState: any = {};
  let currentState = "IDLE"; // Default state
  let currentWorkflow = {};

  const handleStartRecording = () => {
    chrome.runtime.sendMessage({ action: "startRecording" }, (response) => {
      console.log("State updated to:", response.state);
    });
  };

  const handleStopRecording = () => {
    chrome.runtime.sendMessage({ action: "stopRecording" }, (response) => {
      console.log("State updated to:", response.state);
    });
  };

  const unwatchState = storage.watch<any>(
    "local:state",
    (newState, oldState) => {
      currentState = newState?.state;
      // appState = newState;
      // console.log(newState);
      // lAppState = newState?.appState || "IDLE";
      // lRecordingStep = newState?.recordingStep || [];
      // lUserPreferences = newState?.userPreferences || {};
    }
  );

  const unwatchWorkflow = storage.watch<any>(
    "local:workflow",
    (newState, oldState) => {
      currentWorkflow = newState?.workflow;
      // appState = newState;
      // console.log(newState);
      // lAppState = newState?.appState || "IDLE";
      // lRecordingStep = newState?.recordingStep || [];
      // lUserPreferences = newState?.userPreferences || {};
    }
  );

  onMount(async () => {
    const response = await chrome.runtime.sendMessage({ action: "queryState" });
    currentState = response.state;
    currentWorkflow = response.workflow;
    // const applicationState = await storage.getItem("local:state");
    // appState = applicationState
    // console.log('onMount',appState)
    // appState.state = "IDLE"
    // appState.state = "IDLE";
  });

  // onDestroy(async () => {
  //   // unwatchState();
  // });

  // async function toggleCapture() {
  //   console.time("ExecutionTime");
  //   // capturing.update((n) => !n); // Toggle the state
  //   // You still need to send a message to the background script to update other parts of the extension
  //   if(appState?.state === 'IDLE'){
  //     await storage.setItem("local:state", { state: "RECORDING" });
  //     // call start recording
  //   }else{
  //     await storage.setItem("local:state", { state: "IDLE" });
  //     // call end recording
  //   }
  //   console.timeEnd("ExecutionTime");
  //   // chrome.runtime.sendMessage({ action: "toggleCapturing" });
  // }

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

<!-- {currentState}
{JSON.stringify(currentWorkflow)} -->
<div class="flex flex-col items-center justify-center p-4 bg-gray-100 h-full">
  <button
    class="{currentState === 'RECORDING'
      ? 'bg-red-500 hover:bg-red-700'
      : 'bg-blue-500 hover:bg-blue-700'} px-4 py-2 text-white font-bold rounded transition duration-150 ease-in-out"
    on:click={currentState === "RECORDING"
      ? handleStopRecording
      : handleStartRecording}
  >
    {currentState === "RECORDING" ? "End Capture" : "Start Capture"}
  </button>
  <!-- <p class="mt-4 text-lg">{lAppState ? "Capturing..." : "Idle"}</p> -->
</div>

<div>
  {#if currentWorkflow && currentWorkflow?.contentBlocks && currentWorkflow?.contentBlocks.length > 0}
  <div>
    {#each currentWorkflow?.contentBlocks as block}
      {#each block as {screenshot}}
        {#if screenshot.url}
          <!-- Display each screenshot using an img tag with a base64 source -->
          <img src="{screenshot.url}" alt="Screenshot" />
        {:else}
          <!-- Fallback in case there's no screenshot.url -->
          <p>No screenshot available</p>
        {/if}
      {/each}
    {/each}
  </div>
{:else}
  <!-- Fallback in case contentBlocks is not available yet -->
  <p>Loading contentBlocks or no content available...</p>
{/if}
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
