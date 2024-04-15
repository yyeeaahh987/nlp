
from flask import Flask, request, jsonify
from transformers import BartForConditionalGeneration, BertTokenizer, Text2TextGenerationPipeline
import torch

tokenizer = BertTokenizer.from_pretrained("fnlp/bart-base-chinese")
special_tokens_dict = {'additional_special_tokens': ['[user]', '[bot]']}
tokenizer.add_special_tokens(special_tokens_dict)

model = BartForConditionalGeneration.from_pretrained("/model")

app = Flask(__name__)

@app.route('/', methods=['POST'])
def handle_post():
    if request.is_json:
        data = request.get_json()  # Get the JSON data
        print("Data Received: ", data)
        
        input_text = data["content"]
        # Tokenize the input text and return PyTorch tensors
        input_tokens = tokenizer.encode(input_text, return_tensors='pt', add_special_tokens=False)

        # Generate a response
        output_tokens = model.generate(torch.tensor(input_tokens), max_length=50, num_beams=2)
        # Decode the token IDs to a string
        response = tokenizer.decode(output_tokens[0],skip_special_tokens=True).replace(" ", "")

        # Process data (this is just a placeholder for your processing logic)
        response_data = {
            "message": "Data received",
            "response": response
        }
        
        return jsonify(response_data), 200
    else:
        return jsonify({"error": "Request must be JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)


