from pinecone import Pinecone, ServerlessSpec
import chromadb
import numpy as np
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY", "Wrong API Key"))

chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="index_submissions")

df = pd.read_csv("check_redundant/activities_with_definitions (2).csv")
data_list = (
    df["ar_name_activity"].astype(str) + " : " + df["ar_description"].astype(str)
).tolist()

data_list += (
    df["name_activity"].astype(str) + " : " + df["definition"].astype(str)
).tolist()

embed_model = pc.inference


def is_redundant_among_history(
    activity_id, activity_title, activity_description, threshold=0.6
):
    """
    Checks if an activity is redundant based on vector similarity and inserts it if not.

    Args:
        activity_title (str): Title of the activity.
        activity_description (str): Description of the activity.
        collection (ChromaDB Collection): The vector database collection.
        embed_model: The embedding model (e.g., Llama-text-embed-v2).

    Returns:
        dict: { "redundant": bool, "similar_activities": list }
    """
    # Combine title and description
    query_text = f"{activity_title} : {activity_description}"

    # Embed the query
    query_embedding = embed_model.embed(
        model="llama-text-embed-v2",
        inputs=[query_text],
        parameters={"input_type": "passage"},
    )[0]["values"]

    # Search in ChromaDB
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=10,  # Get top 10 similar activities
    )

    # Extract results
    similarities = results["distances"][0]  # ChromaDB returns cosine distance
    activity_ids = results["ids"][0]  # Extract matching IDs

    # Convert cosine distance to similarity (cosine similarity = 1 - distance)
    similar_activity_ids = [
        activity_id
        for sim, activity_id in zip(similarities, activity_ids)
        if (1 - sim) > threshold
    ]

    # If redundancy is found, return the similar activity IDs
    if similar_activity_ids:
        return {"redundant": True, "similar_activities": similar_activity_ids}

    # Otherwise, insert the new activity into ChromaDB
    collection.add(
        embeddings=[query_embedding],
        metadatas=[{"text": query_text}],
        ids=[str(activity_id)],  # Generate a unique ID
    )

    return {"redundant": False, "similar_activities": []}
