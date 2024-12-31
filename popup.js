
const controls = ['textColor', 'fontSize', 'bgColor', 'bgOpacity'];

controls.forEach(control => {
  document.getElementById(control).addEventListener('change', async (e) => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.tabs.sendMessage(tab.id, {
      action: 'updateStyle',
      control: control,
      value: e.target.value
    });
  });
});

// Atualiza o h1 quando receber nova legenda
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updateCaptionText' && request.text) {
    document.getElementById('currentCaption').textContent = request.text;
  }
});