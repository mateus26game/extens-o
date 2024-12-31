
let isNarratorEnabled = false;
let selectedVoice = null;
let speechRate = 1;

window.speechSynthesis.onvoiceschanged = () => {
  const voiceSelect = document.getElementById('voice');
  const voices = window.speechSynthesis.getVoices();
  const brVoices = voices.filter(voice => voice.lang.includes('pt-BR'));
  
  voiceSelect.innerHTML = brVoices.map(voice => 
    `<option value="${voice.name}">${voice.name}</option>`
  ).join('');
};

document.getElementById('toggleNarrator').addEventListener('click', () => {
  isNarratorEnabled = !isNarratorEnabled;
  const button = document.getElementById('toggleNarrator');
  button.textContent = isNarratorEnabled ? 'Desativar Narrador' : 'Ativar Narrador';
  button.style.background = isNarratorEnabled ? '#dc3545' : '#007bff';
});

document.getElementById('voice').addEventListener('change', (e) => {
  selectedVoice = e.target.value;
});

document.getElementById('speed').addEventListener('input', (e) => {
  speechRate = parseFloat(e.target.value);
  document.getElementById('speedValue').textContent = speechRate.toFixed(1) + 'x';
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updateCaptionText' && request.text) {
    const captionText = request.text.trim();
    document.getElementById('currentCaption').textContent = captionText;
    
    if (isNarratorEnabled && captionText) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(captionText);
      const voices = window.speechSynthesis.getVoices();
      
      if (selectedVoice) {
        utterance.voice = voices.find(voice => voice.name === selectedVoice);
      }
      
      utterance.rate = speechRate;
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  }
});