import ollama
import json


def embed_list(words: list):
    return list(ollama.embeddings(model="llama3.1", prompt=json.dumps(words)).values())[
        0
    ]
