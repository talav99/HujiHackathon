
from flask import Flask, request, jsonify
from verifytextfuncs import generate_output

app = Flask(__name__)

@app.route("/hello", methods=["POST", "OPTIONS"])
def hello():
    if request.method == "OPTIONS":
        # CORS preflight handling
        response = app.make_default_options_response()
        headers = response.headers

        headers["Access-Control-Allow-Origin"] = "*"
        headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        headers["Access-Control-Allow-Headers"] = "Content-Type"

        return response

    data = request.get_json()
    url = data.get("url")
    selected_text = data.get("selectedText")
    title = data.get("title")

    print("Received from browser:")
    print("URL:", url)
    print("Title:", title)
    print("Selected Text:", selected_text)

    # Process with your custom function
    output = generate_output(url, selected_text)

    response = jsonify(output=output)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == "__main__":
    app.run(debug=True)
