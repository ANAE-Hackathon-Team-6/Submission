import random
import pandas as pd
# Initialize Pinecone
from pinecone import Pinecone, ServerlessSpec
pc = Pinecone(api_key="pcsk_34KbSm_2WQhegrRfgD8uQjoUw8VNgjXhfgWxqA7KLMGZaqNjCB5XiDvjrdMkgasYhrWtZD")
real_activities = pd.read_csv("check_redundant/activities_with_definitions (2).csv")

def is_redundant(activity, description):
    """
    function to determine if an activity is redundant.
    
    """
    is_redundant, most_similar, redundant_activities = check_redundant_logic(activity, description)
    return {"is_redundant": is_redundant,  "most_similar" : most_similar, "redundant_activities" : redundant_activities}


def check_redundant_logic(activity, description) -> tuple[bool, list[str], list[str]]:

    # Placeholder logic: Randomly reject half the time (you can replace this logic)
    def get_relevant(query, top_k=10, threshold=0.4, real_activities=None):
        index_name = "final-index-desc"  
        if not index_name in pc.list_indexes().names():
            index = pc.create_index(
                name=index_name,
                dimension=1024,
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region="us-east-1"
                ) 
            )
        else:
            index = pc.Index(index_name)

        # Generate embedding for the query
        query_embedding = pc.inference.embed(
            model="llama-text-embed-v2",
            inputs=[query],
            parameters={"input_type": "query"}
        )

        # Perform Pinecone query
        res = index.query(
            namespace="ns1",
            vector=query_embedding[0].values,  # Use the correct embedding format
            top_k=top_k,
            include_values=False,
            include_metadata=True
        )
        # Extract matches
        matches = res.get("matches", [])

        # Filter relevant results based on threshold
        filtered_matches = [match for match in matches if match["score"] >= threshold]

        # Prepare redundant activity IDs
        redundant_activities = [int(match["id"]) for match in filtered_matches]

        # Retrieve all similar activities using .loc[] and checking for valid indices
        most_similar = (
            real_activities.loc[redundant_activities, "name_activity"].tolist()
            # if redundant_activities and real_activities is not None
            # else ["No similar activity found"]
        )

        # Determine if there's redundancy
        is_redundant = len(redundant_activities) > 0

        return is_redundant, most_similar, redundant_activities
    is_redundant, most_similar, redundant_activities = get_relevant(activity+" "+description, top_k=10, threshold=0.4, real_activities=real_activities)

    return is_redundant, most_similar, redundant_activities


