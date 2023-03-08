
const extensionId = chrome.runtime.id;

chrome.action.onClicked.addListener(async function () {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ['content.js'],
    });
});

chrome.runtime.onMessage.addListener(
    
    function (request, sender, sendResponse) {
        function setCookie(name, value, days) {
            const extensionOrigin = chrome.runtime.getURL('');
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            chrome.storage.local.set({ "chimpkey": value });            
        }
        
        if (request.command === "CB_setApiToken") {
            setCookie("textValue", request.newAPIToken, 30)
        }
    }
);

