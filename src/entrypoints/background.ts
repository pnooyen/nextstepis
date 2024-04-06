import { storage } from "wxt/storage";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { v4 as uuidv4 } from "uuid";

export default defineBackground(() => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  console.log("Hello background!", { id: browser.runtime.id });
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

  let currentState = "IDLE"; // Default state
  let currentWorkflow = {};

  chrome.runtime.onInstalled.addListener(async (details) => {
    storage
      .setItem("local:state", { state: "IDLE" })
      .catch(console.error);
  });

  chrome.runtime.onStartup.addListener(async () => {
    const applicationState = await storage.getItem("local:state");
    currentState = applicationState?.state;
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "queryState") {
      sendResponse({ state: currentState, workflow: currentWorkflow });
    } else if (message.action === "startRecording") {
      const currentDate = dayjs().toISOString();
      currentState = "RECORDING";
      currentWorkflow = {
        id: uuidv4(),
        title: "Test Title",
        description: "",
        visibility: "PRIVATE",
        createdAt: currentDate,
        updatedAt: currentDate,
        contentBlocks: [],
      };

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: "startRecording" });
      });
      // Update storage in the background without awaiting its completion

      storage
        .setItem("local:state", {
          state: currentState,
        })
        .catch(console.error);

        storage
        .setItem("local:workflow", {
          workflow: currentWorkflow,
        })
        .catch(console.error);
        
      // Respond immediately
      sendResponse({ state: currentState, workflow: currentWorkflow });
    } else if (message.action === "stopRecording") {
      currentState = "IDLE";
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: "stopRecording" });
      });
      storage
        .setItem("local:state", { state: "IDLE" })
        .catch(console.error);
      sendResponse({ state: currentState, workflow: currentWorkflow });
    } else if (
      message.action === "captureScreen" &&
      currentState === "RECORDING"
    ) {
      const currentDate = dayjs().toISOString();
      chrome.tabs.captureVisibleTab(null, {}, (imageUri) => {
        // Process captured image, for example, sending it to the panel or saving it
        const contentBlock = [
          {
            id: uuidv4(),
            eventType: "click",
            createdAt: currentDate,
            updatedAt: currentDate,
            screenshot: {
              url: imageUri,
            },
          },
        ];
        console.log("Captured Image URI: ", contentBlock);

        currentWorkflow?.contentBlocks?.push(contentBlock);
        storage
          .setItem("local:workflow", { workflow: currentWorkflow })
          .catch(console.error);
      });
    }

    return true; // For asynchronous use of sendResponse()
  });

  chrome.tabs.onActivated.addListener((activeInfo) => {
    // activeInfo.tabId contains the tab ID of the newly active tab
    console.log("activeInfo", activeInfo);
    chrome.tabs.get(activeInfo.tabId, function(tab) {
    if (currentState === "RECORDING") {
      chrome.tabs.sendMessage(activeInfo.tabId, { action: "startRecording" });
    } else {
      chrome.tabs.sendMessage(activeInfo.tabId, { action: "stopRecording" });
    }
    });


    // // Optionally, you might want to query the tab to ensure it meets certain conditions
    // chrome.tabs.get(activeInfo.tabId, function(tab) {
    //   // Check if the tab's URL is one you want to run your content script on
    //   // For example, if you only want to run on pages within a specific domain:
    //   chrome.tabs.sendMessage(activeInfo.tabId, { action: "startRecording" });
    //   // if (tab.url && tab.url.includes("example.com")) {
    //   //   // Send a message to the content script in the newly active tab
    //   //   // chrome.tabs.sendMessage(activeInfo.tabId, {message: "Tab activated"});
    //   //   chrome.tabs.sendMessage(activeInfo.tabId, { action: "startRecording" });
    //   // }
    // });
  });

  // const unwatchState = storage.watch<any>(
  //   "local:state",
  //   (newState, oldState) => {
  //     if (newState.state === "RECORDING") {
  //       console.log('background LOG')
  //     }
  //   }
  // );

  //     // handle RECORDING state
  //     function handleRecording(appState) {
  //       if (appState.state === "RECORDING") {
  //         document.addEventListener("mouseover", highlightElement);
  //         document.addEventListener("mouseout", removeHighlight);
  //       }
  //     }

  // browser.contextMenus.create({
  //   id: 'screenshot',
  //   title: 'Take Screenshot',
  // });

  // browser.action.onClicked.addListener(() => browser.sidePanel.open());
  // chrome.sidePanel
  //   .setPanelBehavior({ openPanelOnActionClick: true })
  //   .catch((error) => console.error(error));

  // background.ts
  // let capturing = false; // Global capturing state

  // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //   if (message.action === "toggleCapturing") {
  //     capturing = !capturing;
  //     sendResponse({ capturing });
  //   } else if (message.action === "queryCapturingState") {
  //     sendResponse({ capturing });
  //   }
  // });

  // browser.contextMenus.onClicked.addListener(async (info, tab) => {
  //   if (info.menuItemId !== 'screenshot') return;

  //   const res = await browser.tabs.captureVisibleTab(tab?.windowId, {
  //     format: 'jpeg',
  //     quality: 100,
  //   });
  //   console.log(res)
  // });
});
