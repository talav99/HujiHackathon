# Verifinance Chrome Extension

**Verifinance** is a Chrome extension that verifies the reliability of selected financial text from any website using Google Gemini AI. It evaluates the selected content and the source domain, providing a credibility score and suggested trustworthy links — all within a user-friendly popup.

## 🔧 Features

- 🖱️ **Right-click to verify** any selected financial text
- 🤖 **AI-backed analysis** using Google Gemini
- 🔍 **Domain reliability check** for trusted sources
- 💾 **Auto-saves** the selected content locally
- 🎉 **Visual effects** (e.g., confetti) for top-rated sources
- 🖼️ **Displays AI feedback** in a styled modal with your logo

## 🧩 How to Use

### 1. 🧪 Prerequisites

- Google Chrome (latest version)
- Python 3.8+
- Flask (`pip install flask`)
- Google Generative AI SDK (`pip install google-generativeai`)
- Valid Google Gemini service account JSON file
- `.env` file for environment variables (optional)
- Backend running on `http://localhost:5000`

### 2. 🚀 Getting Started

#### Backend (Flask + Gemini AI)

1. **Clone the project** and ensure `verifytextfuncs.py` and `gemini.py` are present.
2. Set your service account file path in `Gemini._SERVICE_ACCOUNT_FILE_PATH`.
3. Run the Flask backend:

```bash
python app.py
```

Flask server will start on `http://localhost:5000`.

#### Chrome Extension

1. Open `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked** and select the extension folder.
4. Once installed, right-click any selected text on a webpage.
5. Click **"Verifinance"** from the context menu.
6. A styled popup will appear with:
   - AI-generated score
   - Recommended source links
   - Trustworthiness of the domain
   - A festive animation if the score is 100 🎉

## 📁 Project Structure

```
verifinance-extension/
├── background.js           # Extension logic
├── manifest.json          # Chrome extension config
├── popup.html             # Popup display logic
├── logo.jpg / icons       # Branding assets
├── app.py                 # Flask server
├── verifytextfuncs.py     # Domain + text reliability logic
├── gemini.py              # Gemini API client
└── .env                   # (Optional) Environment vars
```

## ✅ Example Flow

1. **User selects** a sentence like: `"This penny stock will make you rich!"`
2. **Right-click → Verifinance**
3. The extension sends:

```json
{
  "url": "https://randomfinancialblog.com/post123",
  "title": "Secret Stock Tips",
  "selectedText": "This penny stock will make you rich!"
}
```

4. The backend:
   - Checks if the domain is trusted
   - Evaluates the sentence for financial credibility using Gemini AI
   - Returns a score and recommended sources

5. **Popup modal shows results**, e.g.:
   ```
   score: 20
   based on the source site: https://www.bloomberg.com/news/...
   ```

## 🧠 Gemini AI Models Supported

You can choose from:
- `gemini-1.5-flash` (default)
- `gemini-2.0-flash`
- `gemini-2.5-pro-preview-05-06`
- ...and others defined in `Gemini.AVAILABLE_MODELS`

## 🛠️ Customization

- **Trusted Domains**: Modify `TRUSTED_DOMAINS` in `verifytextfuncs.py`
- **Popup UI**: Edit styles inside the script section in `background.js`
- **Animation**: Confetti effect triggered when score is 100

## 🧪 Troubleshooting

- Make sure the Flask server is running at `http://localhost:5000`
- Use correct path to your Google Gemini service account JSON
- Check console logs (`background.js`) for fetch or runtime errors

## 📄 License

MIT License