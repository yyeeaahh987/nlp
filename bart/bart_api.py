from flask import Flask, request, jsonify
from transformers import BartForConditionalGeneration, BertTokenizer, Text2TextGenerationPipeline, pipeline
import torch
import ast, csv, random
import pandas as pd


output_file_path = "/dataset(3)/knowledge_set.csv"
pipe = pipeline("token-classification", model="ckiplab/bert-base-chinese-ner")

tokenizer = BertTokenizer.from_pretrained("fnlp/bart-base-chinese")
special_tokens_dict = {'additional_special_tokens': ['[user]', '[bot]']}
tokenizer.add_special_tokens(special_tokens_dict)

model = BartForConditionalGeneration.from_pretrained("/")

app = Flask(__name__)

@app.route('/', methods=['POST'])
def handle_post():
    if request.is_json:
        data = request.get_json()  # Get the JSON data
        print("Data Received: ", data)
        use_Bart = True
        user_input = data["content"]
        #user_input = "王力宏演三國演義"
        
        user_input_ner = pipe(user_input)
        user_input_name = ""
        for rows in user_input_ner:
            if rows["entity"] == "B-PERSON" or rows["entity"] == "I-PERSON" or rows["entity"] == "E-PERSON":
                user_input_name += rows["word"]

        if user_input_name != "":
            user_q_type = ""
            words_to_checked = {"谁":"简介","唱":"演唱","歌":"演唱","怎样":"评论","评论":"评论","演":"主演","奖":"获奖","成就":"成就","血型":"血型"}
            for query in words_to_checked.keys():
                if user_input.find(query) != -1 :
                    user_q_type = words_to_checked[query]
            
            df = pd.read_csv(output_file_path)
            #df_name = user_input_name
            #df_type = user_q_type
            condition =  (df['name'] == user_input_name) &(df['type'] == user_q_type) #& (df['descriptions'].str.contains('谭朗昌', na=False)) 

            filtered_df = df[condition]

            # Check and Output
            if filtered_df.empty:
                pass
            else:
                if filtered_df.shape[0]>1:
                    response = filtered_df.iloc[random.randrange(0, filtered_df.shape[0])]["descriptions"]
                    use_Bart = False
                else: 
                    response = filtered_df.iloc[0]["descriptions"]
                    use_Bart = False
        
        if use_Bart:
        # Tokenize the input text and return PyTorch tensors
            user_input = "[user]"+user_input
            input_tokens = tokenizer.encode(user_input, return_tensors='pt', add_special_tokens=False)

            # Generate a response
            output_tokens = model.generate(torch.tensor(input_tokens), max_length=50, num_beams=2)
            # Decode the token IDs to a string
            response = tokenizer.decode(output_tokens[0],skip_special_tokens=True).replace(" ", "")

            # Remove new special token
            if response[1:4] == "bot":
                response = response[5:]

        # Process data (this is just a placeholder for your processing logic)
        response_data = {
            "message": "Data received",
            "content": response
        }
        
        return jsonify(response_data), 200
    else:
        return jsonify({"error": "Request must be JSON"}), 400

if __name__ == '__main__':
    app.run(debug=True)
