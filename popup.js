
document.addEventListener('DOMContentLoaded', function() {
  const iniciarBtn = document.getElementById('iniciar');
  const pararBtn = document.getElementById('parar');
  const transcricaoDiv = document.getElementById('transcricao');

  iniciarBtn.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "iniciarTranscricao"
      });
    });
  });

  pararBtn.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "pararTranscricao"
      });
    });
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "atualizarTranscricao") {
      transcricaoDiv.textContent += message.texto;
    }
  });
});