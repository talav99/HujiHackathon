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
                        <div style="font-size: 24px; margin-bottom: 12px;">Verifinance</div>
                        <div style="color: #555;">${fetchedText}</div>
                    `;

                    const closeBtn = document.createElement('button');
                    closeBtn.textContent = 'Close';
                    closeBtn.style.cssText = `
                        margin-top: 16px;
                        padding: 8px 16px;
                        border: none;
                        background: #242ebd;
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

                    // 🎉 Confetti-like Dollar Animation if score is 100
if (fetchedText.includes("score: 100")) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 99999;
    `;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const particles = Array.from({ length: 200 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight,
        speedY: 1 + Math.random() * 2,
        size: 12 + Math.random() * 6,
        char: "$"
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 16px sans-serif";
        ctx.fillStyle = "#28a745";
        particles.forEach(p => {
            ctx.font = `${p.size}px sans-serif`;
            ctx.fillText(p.char, p.x, p.y);
            p.y += p.speedY;
            if (p.y > window.innerHeight) {
                p.y = -20;
                p.x = Math.random() * window.innerWidth;
            }
        });
        requestAnimationFrame(draw);
    }

    draw();

    setTimeout(() => {
        canvas.remove();
    }, 5000);
}

                },
                args: [fetchedText]
            });
        });
    }
});

