import os
import tldextract
import google.generativeai as genai
from dotenv import load_dotenv
import re
import gemini

MODEL = gemini.init_model("gemini-2.0-flash-lite")
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
        f"score: 100 \nThe domain {full_domain} is considered a reliable financial source."
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
    #response = MODEL.ask(prompt)
    response = "70 https://www.bloomberg.com/news/articles/2023-10-01/example-article\n"
    return response.splitlines()


def generate_output(url, article_text):
    domain_trust, domain_name, domain_explanation = check_domain_reliability(url)
    if domain_trust:
        return domain_explanation
    score_response = check_text_reliability(article_text)
    numbers = []
    for line in score_response:
        # Extract substring at positions 6-8 (index 5 to 8, exclusive)
        substring = line[5:8]
        # Extract numeric part from substring
        num_str = ''
        for ch in substring:
            if ch.isdigit():
                num_str += ch
            else:
                break
        if num_str:
            numbers.append(int(num_str))
    if numbers:
        response =  str(sum(numbers) / len(numbers)) + "\n"
        for line in score_response:
            match = re.search(r'\d+', line)
            if match:
                response += line[match.end():] + "\n"
            response += "\n"
        return response
    else:
        return "0\nNo relevant references found.\n"


# def generate_output(url, article_text):
#         domain_trust, domain_name, domain_explanation = check_domain_reliability(url)
#
#         # Always check text, regardless of domain trust
#         score_response = check_text_reliability(article_text)
#
#         numbers = []
#         links = []
#
#         for line in score_response:
#             # Try to match: Score: <number> <url>
#             match = re.match(r"Score:\s*(\d+)\s+(https?://\S+)", line)
#             if match:
#                 score = int(match.group(1))
#                 url = match.group(2)
#                 numbers.append(score)
#                 links.append(url)
#             elif "Score: 0" in line:
#                 return "⚠️ Baseless claim detected.\nScore: 0", []
#
#         if numbers:
#             avg_score = round(sum(numbers) / len(numbers), 2)
#             return f"✅ Verified claims found.\nAverage Score: {avg_score}", links
#
#         return "⚠️ No verifiable sources found.", []

if __name__ == '__main__':

    url = "https://www.shahar.com/news/articles/2023-10-01/example-article"
    article_text = "This is an example article text that discusses economic trends."

    score = generate_output(url, article_text)
    print(score)
    # if links:
    #     print("Relevant Links:")
    #     for link in links:
    #         print(link)