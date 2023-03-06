chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.command === "getHTML")
        sendResponse({content: document.body.innerHTML});
    }
);