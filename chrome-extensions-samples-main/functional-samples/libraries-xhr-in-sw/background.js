

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-selection",
    title: "Save selected text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "save-selection") {
    const selectedText = info.selectionText;
    const url = tab.url;
    const title = tab.title;

    chrome.storage.local.set({
      savedData: {
        url,
        title,
        selectedText,
        timestamp: new Date().toISOString()
      }
    }, () => {
      console.log("Selected text saved:", selectedText);

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: function (text) {
          const existing = document.getElementById("extension-popup-modal");
          if (existing) existing.remove();

          const modal = document.createElement('div');
          modal.id = "extension-popup-modal";
          modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            color: #333;
            padding: 24px 32px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            z-index: 100000;
            font-family: 'Segoe UI', sans-serif;
            font-size: 16px;
            text-align: center;
            max-width: 80vw;
            max-height: 60vh;
            overflow-y: auto;
            animation: fadeIn 0.3s ease-out;
          `;

          modal.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 12px;">✅ Text Saved</div>
            <div style="color: #555;">"${text.substring(0, 200)}${text.length > 200 ? '...' : ''}"</div>
          `;

          const closeBtn = document.createElement('button');
          closeBtn.textContent = 'Close';
          closeBtn.style.cssText = `
            margin-top: 16px;
            padding: 8px 16px;
            border: none;
            background: #4CAF50;
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          `;
          closeBtn.onclick = () => modal.remove();
          modal.appendChild(closeBtn);

          const style = document.createElement('style');
          style.textContent = `
            @keyframes fadeIn {
              from { opacity: 0; transform: translate(-50%, -60%); }
              to { opacity: 1; transform: translate(-50%, -50%); }
            }
          `;
          document.head.appendChild(style);
          document.body.appendChild(modal);
        },
        args: [selectedText]
      });
    });
  }
});

