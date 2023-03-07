
chrome.action.onClicked.addListener(async function() {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    chrome.scripting.executeScript({
        target: {tabId: tab.id, allFrames: true},
        files: ['content.js'],
    });
  });