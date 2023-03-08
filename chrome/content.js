chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.command === "getHTML")
        sendResponse({
          title: document.URL,
          content: document.body.innerHTML
        });
    }
);