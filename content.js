
let recognition = null;
let transcricaoContainer = null;

function criarContainerLegendas() {
  if (!transcricaoContainer) {
    transcricaoContainer = document.createElement('div');
    transcricaoContainer.style.cssText = `
      position: fixed;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 10000;
      max-width: 80%;
      text-align: center;
      font-size: 18px;
      display: none;
      transition: opacity 0.3s ease;
      line-height: 1.4;
    `;
    document.body.appendChild(transcricaoContainer);
  }
}

function iniciarReconhecimento() {
  if (!recognition) {
    criarContainerLegendas();
    recognition = new webkitSpeechRecognition();
    
    // Configurações otimizadas
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';
    recognition.maxAlternatives = 1;  // Reduz processamento de alternativas
    
    let ultimaTranscricao = '';
    let timeoutId = null;

    recognition.onstart = () => {
      console.log('Reconhecimento iniciado');
      transcricaoContainer.style.display = 'block';
    };

    recognition.onresult = (event) => {
      let transcricaoAtual = '';
      
      // Otimização do loop de resultados
      const resultado = event.results[event.results.length - 1];
      if (resultado) {
        transcricaoAtual = resultado[0].transcript.trim();
        
        // Só atualiza se o texto mudou
        if (transcricaoAtual !== ultimaTranscricao) {
          ultimaTranscricao = transcricaoAtual;
          
          // Limpa timeout anterior
          if (timeoutId) clearTimeout(timeoutId);
          
          // Atualiza o container
          if (transcricaoContainer) {
            transcricaoContainer.textContent = transcricaoAtual;
            transcricaoContainer.style.opacity = '1';
            
            // Remove texto após 3 segundos de silêncio
            timeoutId = setTimeout(() => {
              transcricaoContainer.style.opacity = '0';
            }, 3000);
          }
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Erro no reconhecimento:', event.error);
      // Reinicia em caso de erro
      if (recognition) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error('Erro ao reiniciar:', e);
          }
        }, 1000);
      }
    };

    recognition.onend = () => {
      // Reinicia com um pequeno delay para evitar sobrecarga
      if (recognition) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error('Erro ao reiniciar:', e);
          }
        }, 500);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Erro ao iniciar:', e);
    }
  }
}

function pararReconhecimento() {
  if (recognition) {
    recognition.stop();
    recognition = null;
    if (transcricaoContainer) {
      transcricaoContainer.style.opacity = '0';
      setTimeout(() => {
        transcricaoContainer.style.display = 'none';
      }, 300);
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "iniciarTranscricao") {
    iniciarReconhecimento();
  } else if (message.action === "pararTranscricao") {
    pararReconhecimento();
  }
});