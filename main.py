# import nltk
# from nltk.corpus import stopwords
# from nltk.tokenize import word_tokenize, sent_tokenize
# from collections import Counter
#
# # Download required resources (only once)
# # nltk.download('punkt_tab')
# # nltk.download('stopwords')
# # nltk.download('averaged_perceptron_tagger_eng')
#
# def extract_subject(text):
#     # Tokenize text into words
#     words = word_tokenize(text.lower())
#
#     # Remove stopwords and punctuation
#     stop_words = set(stopwords.words('english'))
#     filtered_words = [word for word in words if word.isalnum() and word not in stop_words]
#
#     # Part-of-speech tagging
#     tagged_words = nltk.pos_tag(filtered_words)
#
#     # Focus on nouns (NN = noun, singular; NNS = noun plural; NNP = proper noun)
#     noun_words = [word for word, tag in tagged_words if tag in ('NN', 'NNS', 'NNP', 'NNPS')]
#
#     # Count noun frequency
#     noun_freq = Counter(noun_words)
#
#     # Return the most common noun as the subject
#     if noun_freq:
#         subject, _ = noun_freq.most_common(1)[0]
#         return subject
#     else:
#         return "No clear subject found."
#
# # Example use
# text = """
# The annual Bushwick Brooklyn street art block party is this coming Saturday, so I got to see a lot of artists at work yesterday getting all the new murals ready.
# There’ll be artists out there all week painting (weather permitting).
# ;
# """
#
# print("Subject:", extract_subject(text))


import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
from collections import Counter

# Download required resources
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('averaged_perceptron_tagger')
# nltk.download('wordnet')
# nltk.download('omw-1.4')

lemmatizer = WordNetLemmatizer()

# Helper to map POS tags to WordNet POS tags
def get_wordnet_pos(treebank_tag):
    if treebank_tag.startswith('J'):
        return wordnet.ADJ
    elif treebank_tag.startswith('V'):
        return wordnet.VERB
    elif treebank_tag.startswith('N'):
        return wordnet.NOUN
    elif treebank_tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN  # Default to noun

def extract_subject(text):
    words = word_tokenize(text.lower())
    stop_words = set(stopwords.words('english'))
    filtered_words = [word for word in words if word.isalnum() and word not in stop_words]

    tagged_words = nltk.pos_tag(filtered_words)

    # Lemmatize words
    lemmatized_nouns = [
        lemmatizer.lemmatize(word, get_wordnet_pos(tag))
        for word, tag in tagged_words
        if tag.startswith('NN')  # only nouns
    ]

    noun_freq = Counter(lemmatized_nouns)

    if noun_freq:
        subject, _ = noun_freq.most_common(1)[0]
        return subject
    else:
        return "No clear subject found."

# Example
text = """
In india there are 1000000 people living, in berlin 50000 persons live.
"""

print("Subject:", extract_subject(text))