export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // console.log('defineContentScript', 'YAY')
    // document.addEventListener("mouseover", highlightElement);
    // document.addEventListener("mouseout", removeHighlight);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log("defineContentScript", message);
      if (message.action === "startRecording") {
        document.addEventListener("mouseover", highlightElement);
        document.addEventListener("mouseout", removeHighlight);
        document.addEventListener("click", recordingOnClick, true);
      } else if (message.action === "stopRecording") {
        document.removeEventListener("mouseover", highlightElement);
        document.removeEventListener("mouseout", removeHighlight);
        document.removeEventListener("click", recordingOnClick, true);
      }
      return false; // For asynchronous use of sendResponse()
    });

    // const applicationState = await storage.getItem("local:state");
    // appState = applicationState
    // console.log("defineContentScript", applicationState);

    // const unwatchState = storage.watch<any>(
    //   "local:state",
    //   (newState, oldState) => {
    //     // console.log("storage.watch", newState);
    //     // handleRecording(newState);

    //     if (newState.state === "RECORDING") {
    //       document.addEventListener("mouseover", highlightElement);
    //       document.addEventListener("mouseout", removeHighlight);
    //     } else {
    //       document.removeEventListener("mouseover", highlightElement);
    //       document.removeEventListener("mouseout", removeHighlight);
    //     }
    //   }
    // );

    // handle RECORDING state
    // function handleRecording(appState) {
    //   if (appState.state === "RECORDING") {
    //     document.addEventListener("mouseover", highlightElement);
    //     document.addEventListener("mouseout", removeHighlight);
    //   } else {
    //     document.removeEventListener("mouseover", highlightElement);
    //     document.removeEventListener("mouseout", removeHighlight);
    //   }
    // }

    // console.log("Hello content.");

    // // Flag to track whether capturing is active
    // let capturing = false;

    // // Listen for messages from the background script or popup to toggle capturing state
    // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //   console.log("KOKOKKOKOK");
    //   if (true) {
    //     capturing = !capturing;
    //     if (true) {
    //       // Start highlighting elements on mouseover
    //       document.addEventListener("mouseover", highlightElement);
    //       document.addEventListener("mouseout", removeHighlight);
    //     } else {
    //       // Stop highlighting elements
    //       document.removeEventListener("mouseover", highlightElement);
    //       document.removeEventListener("mouseout", removeHighlight);
    //     }
    //     sendResponse({ status: "Capturing state updated to " + capturing });
    //   }
    // });

    function recordingOnClick() {
      chrome.runtime.sendMessage({ action: "captureScreen" });
    }

    // Function to add highlight styling to elements
    function highlightElement(event: MouseEvent) {
      event.stopPropagation(); // Prevent any further event propagation

      // Start with the original event target
      let target = event.target as HTMLElement;

      // Keep moving up the DOM tree until you find the parent div
      while (target !== null && target.nodeName !== "DIV") {
        target = target.parentElement as HTMLElement;
      }

      // If a parent div was found...
      if (target !== null) {
        // Remove borders from all divs first if you want to highlight one at a time
        const allDivs = document.querySelectorAll("div");
        for (let i = 0; i < allDivs.length; i++) {
          allDivs[i].style.border = ""; // Remove the border
        }

        // Then apply the border to the found div
        target.style.border = "2px solid red";
      }
    }

    // Function to remove highlight styling from elements
    function removeHighlight(event: MouseEvent) {
      const target = event.target as HTMLElement;
      target.style.border = "";
    }

    //   function sendToPopup(message) {
    //     chrome.runtime.sendMessage({log: message});
    //   }

    //   function getFullXPath(element) {
    //     let path = [];
    //     for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
    //         let index = 1; // XPath positions are 1-based
    //         for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
    //             // Only count ELEMENT_NODES
    //             if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) continue;
    //             if (sibling.nodeName === element.nodeName) index++;
    //         }

    //         let tagName = element.nodeName.toLowerCase();
    //         let pathIndex = `[${index}]`;
    //         path.unshift(tagName + pathIndex);
    //     }

    //     return '/' + path.join('/');
    // }

    // let currentElement = null;

    // document.addEventListener(
    //   "mouseover",
    //   function (e) {
    //     // Remove highlight from the previously hovered element
    //     if (currentElement) {
    //       currentElement.style.outline = "";
    //     }

    //     // Highlight the new element and log its selector
    //     currentElement = e.target;
    //     currentElement.style.outline = "2px solid red";
    //     var selector = getFullXPath(e.target);
    //   },
    //   false
    // );

    // document.addEventListener(
    //   "mouseout",
    //   function (e) {
    //     // Optionally, remove the highlight when the mouse leaves the element
    //     if (currentElement === e.target) {
    //       currentElement.style.outline = "";
    //       currentElement = null;
    //     }
    //   },
    //   false
    // );
  },
});
