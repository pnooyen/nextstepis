
export default defineContentScript({
  matches: ['https://*/*'],
  main() {
    console.log('Hello content.');

    function sendToPopup(message) {
      chrome.runtime.sendMessage({log: message});
    }
    
    function getFullXPath(element) {
      let path = [];
      for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
          let index = 1; // XPath positions are 1-based
          for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
              // Only count ELEMENT_NODES
              if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) continue;
              if (sibling.nodeName === element.nodeName) index++;
          }
          
          let tagName = element.nodeName.toLowerCase();
          let pathIndex = `[${index}]`;
          path.unshift(tagName + pathIndex);
      }
  
      return '/' + path.join('/');
  }
    let currentElement = null;
    
    document.addEventListener('mouseover', function (e) {
      // Remove highlight from the previously hovered element
      if (currentElement) {
        currentElement.style.outline = '';
      }
    
      // Highlight the new element and log its selector
      currentElement = e.target;
      currentElement.style.outline = '2px solid red';
      var selector = getFullXPath(e.target);
      console.log(selector);
      sendToPopup(selector);
    }, false);
    
    document.addEventListener('mouseout', function (e) {
      // Optionally, remove the highlight when the mouse leaves the element
      if (currentElement === e.target) {
        currentElement.style.outline = '';
        currentElement = null;
      }
    }, false);
    
  },
});


