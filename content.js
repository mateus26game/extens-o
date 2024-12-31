
function findCaptions() {
  return document.querySelectorAll([
    '.captions',
    '.vjs-text-track-display',
    '.ytp-caption-window-container',
    '[class*="caption"]',
    '[class*="subtitle"]'
  ].join(','));
}

function applyCaptionStyles(element, styles) {
  element.style.color = styles.textColor;
  element.style.fontSize = styles.fontSize + 'px';
  element.style.backgroundColor = styles.bgColor;
  element.style.opacity = styles.bgOpacity / 100;
  
  // Envia o texto da legenda para o popup
  chrome.runtime.sendMessage({
    action: 'updateCaptionText',
    text: element.textContent
  });
}

let captionStyles = {
  textColor: '#ffffff',
  fontSize: 16,
  bgColor: '#000000',
  bgOpacity: 70
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updateStyle') {
    captionStyles[request.control] = request.value;
    const captions = findCaptions();
    captions.forEach(caption => applyCaptionStyles(caption, captionStyles));
  }
});

const observer = new MutationObserver((mutations) => {
  const captions = findCaptions();
  captions.forEach(caption => {
    applyCaptionStyles(caption, captionStyles);
    // Observa mudanças no texto da legenda
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
          chrome.runtime.sendMessage({
            action: 'updateCaptionText',
            text: caption.textContent
          });
        }
      });
    }).observe(caption, {
      characterData: true,
      childList: true,
      subtree: true
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});