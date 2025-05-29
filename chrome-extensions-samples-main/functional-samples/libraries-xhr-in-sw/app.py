from flask import Flask, request, jsonify
from verifytextfuncs import generate_output

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    url = data.get("url")
    text = data.get("text")
    result, links = generate_output(url, text)
    return jsonify({
        "result": result,
        "sources": links
    })

if __name__ == "__main__":
    app.run(debug=True)
