input_file_path = "dataset(3)/train.txt"
output_file_path = "dataset(3)/train_newtoken.txt"
new_str = ""
count = 0
import ast
with open(input_file_path,"r") as txt_file:
    for s in txt_file:
        temp_str = ""
        if count >= 3000:
            con_dict = ast.literal_eval(s)
            for i,t in enumerate(con_dict["conversation"]):
                if i == 0 and t[0:3] == "bot":
                        pass
                elif t[0:4] == "user" and i < len(con_dict["conversation"]) - 1:
                    temp_str += "[user]"
                    temp_str += t.lstrip("user: ")
                    temp_str += " "
                elif t[0:3] == "bot":
                    conv = "[bot]" + t.lstrip("bot: ")
                    #conv = t.lstrip("bot: ")
                    new_str += temp_str
                    temp_str += conv
                    temp_str += " "
                    new_str += "\t"
                    new_str += conv
                    new_str += "\n"
        count+=1
with open(output_file_path,"w") as file:
    file.write(new_str)