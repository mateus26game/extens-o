
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "iniciarCaptura") {
    chrome.tabCapture.capture({
      audio: true,
      video: false
    }, stream => {
      if (stream) {
        // Envia o stream para o content script
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "streamPronto",
          stream: stream
        });
      }
    });
  }
});
