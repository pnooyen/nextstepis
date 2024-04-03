import { storage } from 'wxt/storage';

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  browser.contextMenus.create({
    id: 'screenshot',
    title: 'Take Screenshot',
  });

  // browser.action.onClicked.addListener(() => browser.sidePanel.open());
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

  // background.ts
  let capturing = false; // Global capturing state

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
