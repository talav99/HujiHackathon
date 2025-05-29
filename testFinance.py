import os
import tldextract
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
# Set your Gemini API key (from AI Studio: https://makersuite.google.com/app/apikey)
os.environ["GOOGLE_API_KEY"] = os.getenv("API_KEY")

# Configure Gemini model
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("gemini-pro")

# List of trusted economic/financial domains (U.S./global sources)
TRUSTED_DOMAINS = {
    "bloomberg.com",
    "reuters.com",
    "cnbc.com",
    "berkshirehathaway.com",
    "finance.yahoo.com",
    "tradingview.com",
    "marketwatch.com"
}

def check_domain_reliability(url):
    domain = tldextract.extract(url)
    full_domain = f"{domain.domain}.{domain.suffix}"
    is_trusted = full_domain in TRUSTED_DOMAINS
    explanation = (
        f"The domain {full_domain} is considered a reliable financial source."
        if is_trusted else
        f"The domain {full_domain} is not listed as a known reliable source. Caution is advised."
    )
    return is_trusted, full_domain, explanation

def check_text_reliability(text):
    prompt = f""" Check if the text contains a baseless claim or recommendation. If it does, return only:Score: 0.
Otherwise, search only the following websites for relevant references:"bloomberg.com", "reuters.com", "cnbc.com", 
"berkshirehathaway.com", "finance.yahoo.com", "tradingview.com", "marketwatch.com"
For each reference you find, return only one line in the following format:
Score: <number between 0-100> <the url>
Do not add any explanation, summary, or additional text.
Text: {text}"""
    response = model.generate_content(prompt)
    return response.text.strip()

# === Example usage ===
if __name__ == "__main__":
    # Example input
    url = "https://www.exampleblog.com/bitcoin-will-crash"
    article_text = "Experts claim Bitcoin is going to crash next week due to inflation and economic bubbles."

    domain_trust, domain_name, domain_explanation = check_domain_reliability(url)
    print("🔎 Domain Check:")
    print(domain_explanation)

    print("\n🧠 Content Reliability Check:")
    score_response = check_text_reliability(article_text)
    print(score_response)
