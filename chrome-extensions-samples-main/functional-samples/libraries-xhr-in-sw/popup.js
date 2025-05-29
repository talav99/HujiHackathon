
document.addEventListener('DOMContentLoaded', function() {
  const textDiv = document.getElementById('text');

  // Load saved data when popup opens
  chrome.storage.local.get(['savedData'], function(result) {
    if (result.savedData && result.savedData.selectedText) {
      textDiv.textContent = result.savedData.selectedText;
      textDiv.classList.remove('no-data');
    } else {
      textDiv.textContent = 'No text selected yet. Right-click on any text and select "Save selected text".';
      textDiv.classList.add('no-data');
    }
  });

  // Listen for storage changes to update popup in real-time
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local' && changes.savedData) {
      const newData = changes.savedData.newValue;
      if (newData && newData.selectedText) {
        textDiv.textContent = newData.selectedText;
        textDiv.classList.remove('no-data');
      }
    }
  });
});