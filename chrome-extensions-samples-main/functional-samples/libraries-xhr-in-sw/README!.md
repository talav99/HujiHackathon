📊 Verifinance — Chrome Extension for Financial Text Verification
Verifinance is a Chrome Extension that helps users verify the reliability of financial information found on the web. 
It uses Google Gemini to analyze selected text and determines its credibility based on domain reputation and 
cross-referencing with trusted financial sources.

🚀 Features
✅ Right-click any text on a webpage to verify it.

🔍 Automatically checks if the source is a reliable financial domain.

🧠 Uses Gemini AI to find supporting links from trusted sources.

💾 Saves selected data (URL, text, timestamp) locally.

🎉 Displays a styled popup with verification results.

💸 Adds a confetti animation with dollar signs if the score is 100.

🧠 Tech Stack
Frontend: Chrome Extension (Manifest v3, JS)

Backend: Flask (Python)

AI Engine: Google Gemini via Generative AI

Data Storage: Chrome Local Storage

🛠️ Installation & Setup
🔌 Backend (Flask Server)
Clone the repository:

bash
Copy
Edit
git clone https://github.com/yourusername/verifinance
cd verifinance/backend
Install dependencies:

bash
Copy
Edit
pip install flask google-auth google-generativeai tldextract python-dotenv
Add your Google Service Account JSON credentials to:

Copy
Edit
gemini._SERVICE_ACCOUNT_FILE_PATH
Run the Flask server:

bash
Copy
Edit
python app.py
Make sure it runs on http://localhost:5000.

🧩 Chrome Extension
Open Chrome and go to:

arduino
Copy
Edit
chrome://extensions/
Enable Developer Mode.

Click "Load unpacked" and select the extension folder from the project.

You should now see Verifinance in your extensions list.

💡 How to Use
Navigate to any webpage containing financial information.

Highlight the text you want to verify.

Right-click and choose "Verifinance" from the context menu.

The extension:

Sends the selected text + URL to the Flask server.

Uses Gemini to analyze the content.

Checks if the domain is trusted.

Displays a styled popup with the score and relevant sources.

If the score is 100 and the domain is trustworthy, you'll see celebratory dollar-sign confetti!

🛡️ Trusted Domains
Currently trusted financial domains:

bloomberg.com

reuters.com

cnbc.com

berkshirehathaway.com

finance.yahoo.com

tradingview.com

marketwatch.com

📂 Project Structure
pgsql
Copy
Edit
verifinance/
├── backend/
│   ├── app.py
│   ├── verifytextfuncs.py
│   └── gemini.py
├── extension/
│   ├── background.js
│   ├── popup.html
│   ├── manifest.json
│   ├── logo.jpg
│   └── icons/
🧪 Tips for Debugging
Make sure Flask is running on port 5000.

Use the browser console (F12) to view errors.

Keep an eye on terminal output for backend logs.

If the popup doesn’t show, check chrome.storage.local for saved data.

📬 Future Improvements
Database integration to store flagged URLs.

Score-based warning banners on repeat visits.

User feedback collection for false positives/negatives.

