
document.addEventListener('DOMContentLoaded', function() {
  const iniciarBtn = document.getElementById('iniciar');
  const pararBtn = document.getElementById('parar');

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
});