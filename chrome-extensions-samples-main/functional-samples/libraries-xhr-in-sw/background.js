// chrome.runtime.onInstalled.addListener(() => {
//     chrome.contextMenus.create({
//         id: "save-selection",
//         title: "Save selected text",
//         contexts: ["selection"]
//     });
// });
//
// chrome.contextMenus.onClicked.addListener(async (info, tab) => {
//     if (info.menuItemId === "save-selection") {
//         const selectedText = info.selectionText;
//         const url = tab.url;
//         const title = tab.title;
//         const fetchedText = await fetch('http://localhost:5000/hello', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         url,
//         selectedText
//     })
// }).then(res => res.json()).then(data => data.output);
//         console.log("hi")
//         console.log("Fetched text:", fetchedText);
//         chrome.storage.local.set({
//             savedData: {
//                 url,
//                 title,
//                 selectedText,
//                 timestamp: new Date().toISOString()
//             }
//         }, () => {
//             console.log("Selected text saved:", selectedText);
//
//             chrome.scripting.executeScript({
//                 target: {tabId: tab.id},
//                 func: function (text) {
//                     const existing = document.getElementById("extension-popup-modal");
//                     if (existing) existing.remove();
//
//                     const modal = document.createElement('div');
//                     modal.id = "extension-popup-modal";
//                     modal.style.cssText = `
//             position: fixed;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//             background: white;
//             color: #333;
//             padding: 24px 32px;
//             border-radius: 12px;
//             box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
//             z-index: 100000;
//             font-family: 'Segoe UI', sans-serif;
//             font-size: 16px;
//             text-align: center;
//             max-width: 80vw;
//             max-height: 60vh;
//             overflow-y: auto;
//             animation: fadeIn 0.3s ease-out;
//           `;
//
//                     modal.innerHTML = `
//             <div style="font-size: 24px; margin-bottom: 12px;">✅ Text Saved gvhbjnbhgvfdfgv</div>
//             <div style="color: #555;">"${fetchedText}"</div>
//           `
//
//                     const closeBtn = document.createElement('button');
//                     closeBtn.textContent = 'Close';
//                     closeBtn.style.cssText = `
//             margin-top: 16px;
//             padding: 8px 16px;
//             border: none;
//             background: #4CAF50;
//             color: white;
//             border-radius: 6px;
//             cursor: pointer;
//             font-size: 14px;
//           `;
//                     closeBtn.onclick = () => modal.remove();
//                     modal.appendChild(closeBtn);
//
//                     const style = document.createElement('style');
//                     style.textContent = `
//             @keyframes fadeIn {
//               from { opacity: 0; transform: translate(-50%, -60%); }
//               to { opacity: 1; transform: translate(-50%, -50%); }
//             }
//           `;
//                     document.head.appendChild(style);
//                     document.body.appendChild(modal);
//                 },
//                 args: [selectedText]
//             });
//         });
//     }
//     console.log("after if")
// });
//
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

        // 🔁 Send to Flask backend
        const fetchedText = await fetch('http://localhost:5000/hello', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url,
                title,
                selectedText
            })
        })
        .then(res => res.json())
        .then(data => data.output)
        .catch(err => {
            console.error("Fetch error:", err);
            return "Failed to fetch response from server.";
        });

        // ✅ Save data in local storage
        chrome.storage.local.set({
            savedData: {
                url,
                title,
                selectedText,
                timestamp: new Date().toISOString()
            }
        }, () => {
            console.log("Selected text saved:", selectedText);

            // 🪄 Inject the popup into the page
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: function (fetchedText) {
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
                        <div style="font-size: 24px; margin-bottom: 12px;">✅ Text Processed</div>
                        <div style="color: #555;">${fetchedText}</div>
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
                args: [fetchedText]
            });
        });
    }
});

