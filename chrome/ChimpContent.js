console.log("MASSIVE BENIS")

// Add a listener for button clicks
function handleClick() {
    console.log("sending token to background")
    chrome.runtime.sendMessage({ command: 'CB_setApiToken', newAPIToken: "123" });
  }
  
  // Find the button element on the page
  const generateApiKeyButton = document.getElementById('generate-api-key-button');
  
  // Add a click event listener to the button
  generateApiKeyButton.addEventListener('click', handleClick);

