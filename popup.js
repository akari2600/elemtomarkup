document.addEventListener('DOMContentLoaded', function() {
    const mouseSelect = document.getElementById('mouseSelect');
    const selectorSelect = document.getElementById('selectorSelect');
    const selectorInput = document.getElementById('selectorInput');
    const cssSelector = document.getElementById('cssSelector');
    const applySelectorBtn = document.getElementById('applySelectorBtn');

    mouseSelect.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "selectWithMouse"});
        window.close();
      });
    });

    selectorSelect.addEventListener('click', function() {
      selectorInput.style.display = 'block';
    });

    applySelectorBtn.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "selectWithSelector", selector: cssSelector.value});
          });
    });
  });
