import torch
import random
import time
import os
import pickle
import numpy as np
import matplotlib.pyplot as plt
from transformers import BertTokenizer, BartForConditionalGeneration, GPT2Tokenizer, BartTokenizer
from torch.utils.data import DataLoader

def set_seed(seed):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

def get_tokenizer(name="bert"):
    if name == "gpt2":
        tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
    elif name == "bart":
        tokenizer = BartTokenizer.from_pretrained("facebook/bart-large")
    elif name == "bart_chinese":
        tokenizer = BertTokenizer.from_pretrained("fnlp/bart-base-chinese")
    else:
        raise ValueError("Invalid tokenizer name")
    return tokenizer


# In[15]:


from torch.utils.data import Dataset
from tqdm import tqdm
from torch.nn.utils.rnn import pad_sequence
IGNORE_INDEX = -100

class MyDataset(Dataset):
    def __init__(self, data_path, data_partition, model_name, max_seq_len):
        self.data_path = data_path
        self.data_partition = data_partition
        self.tokenizer = get_tokenizer(model_name)
        self.max_seq_len = max_seq_len
        self.pad = self.tokenizer.convert_tokens_to_ids(self.tokenizer.pad_token)
        self.bos = self.tokenizer.convert_tokens_to_ids(self.tokenizer.cls_token)
        self.eos = self.tokenizer.convert_tokens_to_ids(self.tokenizer.sep_token)
        self._cache_instances()
    
    def _cache_instances(self):
        self.data = []
        with open(self.data_path, "r") as f:
            for line in tqdm(f):
                line = line.strip()
                history, response = line.split("\t")
                history = self.tokenizer.encode(history)
                response = self.tokenizer.encode(response)
                self.data.append((history, response))

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        #if self.lm_labels:
        if True:
            history = self.data[index][0]
            response = self.data[index][1]
        else:
            history = self.data[index][0]
            response = []
        return self._process(history, response)

    def _process(self, history, response):
        # truncate previous tokens if dialogue context is too long
        if len(history) > self.max_seq_len - 1:
            input_ids = [self.bos] + history[-self.max_seq_len+1:]
            '''
            count_del = 0
            chopped_str = history[-self.max_seq_len+1:]
            while chopped_str[1:5] != "user" or chopped_str[1:4] != "bot":
                count_del += 1
                chopped_str = chopped_str[count_del:]
            input_ids = [self.bos] + chopped_str
            '''
        else:
            input_ids = [self.bos] + history
            
        decoder_input_ids = [self.bos] + response
        target_ids = response + [self.eos]
        
        instance = {}
        instance["input_ids"] = input_ids
        instance["decoder_input_ids"] = decoder_input_ids
        instance["labels"] = target_ids
        return instance

    def collate(self, batch):
        input_ids = pad_sequence(
            [torch.tensor(instance["input_ids"], dtype=torch.long) for instance in batch], batch_first=True, padding_value=self.pad)
        decoder_input_ids = pad_sequence(
            [torch.tensor(instance["decoder_input_ids"], dtype=torch.long) for instance in batch], batch_first=True, padding_value=self.pad)
        labels = pad_sequence(
            [torch.tensor(instance["labels"], dtype=torch.long) for instance in batch], batch_first=True, padding_value=IGNORE_INDEX)
        
        return input_ids, decoder_input_ids, labels




import torch
import numpy as np
import torch.nn.utils as nn_utils
from transformers.optimization import AdamW, get_linear_schedule_with_warmup

class MyTrainer(object):
    """
    Trainer with `train` and `evaluate` functions.
    """
    def __init__(self,
            model, train_loader, dev_loader, log_steps, num_epochs, lr, validate_steps=10, warmup_ratio=0.1, weight_decay=0.01, \
            max_grad_norm=1.0, device="cpu"
        ):
        self.model = model
        self.train_loader = train_loader
        self.dev_loader = dev_loader
        self.log_steps = log_steps
        self.num_epochs = num_epochs
        self.lr = lr
        self.warmup_ratio = warmup_ratio
        self.weight_decay = weight_decay
        self.max_grad_norm = max_grad_norm
        self.validate_steps = validate_steps
        self.device = device

        if train_loader is not None:
            total_steps = len(train_loader) * self.num_epochs
            self.optimizer = AdamW(self.model.parameters(), lr=self.lr, weight_decay=self.weight_decay, no_deprecation_warning=True)
            self.scheduler = get_linear_schedule_with_warmup(optimizer=self.optimizer, num_warmup_steps=self.warmup_ratio * total_steps, num_training_steps=total_steps)
            self.best_metric = 0.0
    
    def train(self):
        for name, param in self.model.named_parameters():
            param.requires_grad = True
        print("Total batches per epoch : {}".format(len(self.train_loader)), flush=True)
        train_steps = 0
        for epoch in range(self.num_epochs):
            print("\nEpoch {}:".format(epoch + 1), flush=True)
            for batch_step, inputs in enumerate(self.train_loader):
                self.model.train()
                train_steps += 1
                
                input_ids, decoder_input_ids, labels = tuple(input_tensor.to(self.device) for input_tensor in inputs)
                lm_output = self.model(
                    input_ids=input_ids, 
                    decoder_input_ids=decoder_input_ids,
                    labels=labels,
                    return_dict=True
                )
                loss = lm_output["loss"]
                
                loss.backward()
                self.optimizer.step()
                self.scheduler.step()
                self.optimizer.zero_grad()

                if train_steps > 0 and train_steps % self.log_steps == 0:
                    print ("Train Step: {}\ttotal_loss: {:.3f}".format(train_steps, loss.item()))
                    
                #if train_steps > 0 and train_steps % self.validate_steps == 0:
                #    print("Evaluating...")
                #    pred = self.evaluate(loader=self.dev_loader)
                #    # Modify according to your needs !!!

            print("Epoch {} training done.".format(epoch + 1))


    def evaluate(self, loader):
        self.model.eval()
        with torch.no_grad():
            for inputs in loader:
                input_ids, decoder_input_ids, labels = tuple(input_tensor.to(self.device) for input_tensor in inputs)
                lm_output = self.model(
                    input_ids=input_ids, 
                    decoder_input_ids=decoder_input_ids,
                    labels=labels,
                    return_dict=True
                )
                logits = lm_output["logits"]
                loss = lm_output["loss"]
                # Modify according to your needs !!!

    def test(self, test_loader):
        self.model.eval()
        with torch.no_grad():
            for inputs in test_loader:
                input_ids, decoder_input_ids, labels = tuple(input_tensor.to(self.device) for input_tensor in inputs)
                lm_output = self.model(
                    input_ids=input_ids, 
                    decoder_input_ids=decoder_input_ids,
                    labels=labels,
                    return_dict=True
                )
                logits = lm_output["logits"]
                loss = lm_output["loss"]
                # Modify according to your needs !!!

    def save(self):
        self.model.save_pretrained('/model')
        
import torch
#torch.mps.set_per_process_memory_fraction(0.0)


def main():

    seed = 42
    train_file="/dataset(3)/train_newtoken.txt"
    dev_file="/dataset(3)/dev_new.txt"
    #test_file= "/dataset(3)/test.txt"
    
    max_len = 128 #512
    batch_size = 8   #32
    epochs = 1 #10
    learn_rate=2e-5
    log_steps=50
    validate_steps=100
    set_seed(seed)
    start = time.time()
    if torch.cuda.is_available():
        device = "cuda:0"
    #elif torch.backends.mps.is_available():
    #    device = "mps"  
    else:
        device="cpu"
    
    tokenizer = get_tokenizer("bart_chinese")
    
    
    special_tokens_dict = {'additional_special_tokens': ['[user]', '[bot]']}
    tokenizer.add_special_tokens(special_tokens_dict)
    
    
    # For first time of running    
    ###model = BartForConditionalGeneration.from_pretrained("fnlp/bart-base-chinese")
    ###model.resize_token_embeddings(len(tokenizer))
    
    # For second time or onwards
    model = BartForConditionalGeneration.from_pretrained("/model")
    
    model.to(device)
    
    print ("Preparing datasets...", flush=True)
    train_dataset = MyDataset(train_file, "train", "bart_chinese", max_len)
    dev_dataset = MyDataset(dev_file, "dev", "bart_chinese", max_len)
    #test_dataset = MyDataset(test_file, "test", "bart_chinese", max_len)
    
    train_loader = DataLoader(train_dataset,
                collate_fn=train_dataset.collate,
                #num_workers=8,
                batch_size=batch_size,
                shuffle=True)
    dev_loader = DataLoader(dev_dataset,
                collate_fn=dev_dataset.collate,
                #num_workers=8,
                batch_size=batch_size,
                shuffle=False)
    
    trainer = MyTrainer(model=model, train_loader=train_loader, dev_loader=dev_loader, log_steps=log_steps, num_epochs=epochs, lr=learn_rate, validate_steps=validate_steps, device=device, warmup_ratio=0.1, weight_decay=0.01, max_grad_norm=1.0)
    trainer.train()
    '''
    if test_file is not None:
        test_loader = DataLoader(test_dataset,
                    collate_fn=test_dataset.collate,
                    num_workers=10,
                    batch_size=batch_size,
                    shuffle=False)
        trainer.test(test_loader)
    '''
    end = time.time()
    trainer.save()
    print(f"Prcessing Time: {(end-start)/60%60:.4f} min", flush=True)


if __name__ == "__main__":
    main()