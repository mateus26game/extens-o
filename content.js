
let recognition = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "iniciarTranscricao") {
    iniciarReconhecimento();
  } else if (message.action === "pararTranscricao") {
    pararReconhecimento();
  }
});

function iniciarReconhecimento() {
  if (!recognition) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';

    recognition.onresult = (event) => {
      let transcricao = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcricao += event.results[i][0].transcript + '\n';
        }
      }
      
      chrome.runtime.sendMessage({
        action: "atualizarTranscricao",
        texto: transcricao
      });
    };

    recognition.start();
  }
}

function pararReconhecimento() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}