function sendPage(token, contentHTML) {
    console.log(contentHTML)
    fetch('http://localhost:3000/api/chromeExtension/collectWeb', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/html',
            'Authorization': `Bearer ${token}`
        },
        body: contentHTML
    })
        .then(response => {
            if (response.ok) {
                // Handle successful response
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            // Handle fetch error
            console.error('Fetch Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    var token = document.getElementById('api-key');
    var submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', async () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            // Do something with the tab(s) returned by the query
            let tab = tabs[0]
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js'],
            }, () => {
                chrome.tabs.sendMessage(tab.id, { command: "getHTML" }, async function (response) {
                    sendPage(token, await response)
                });
            });

        });

    });
    var apiKeyInput = document.getElementById('api-key');
});