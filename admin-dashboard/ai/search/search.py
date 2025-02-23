import pandas as pd
from pinecone import Pinecone, ServerlessSpec
import google.generativeai as genai
from langdetect import detect
from mtranslate import translate

class SearchAI:
    def __init__(self, pinecone_api_key, gemini_api_key, index_name="final-index-desc", real_activities_path="activities_with_definitions.csv"):
        # Initialize Pinecone
        self.pc = Pinecone(api_key=pinecone_api_key)
        self.index_name = index_name
        self.real_activities = pd.read_csv(real_activities_path)

        # Initialize Pinecone index
        if self.index_name not in self.pc.list_indexes().names():
            self.pc.create_index(
                name=self.index_name,
                dimension=1024,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
        self.index = self.pc.Index(self.index_name)

        # Initialize Google Gemini AI for activity extraction
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def extract_activity(self, query):
        """Extracts the activity from the user's query using Gemini AI."""
        prompt = f"""
        Extract the main business activity mentioned in the following user query:
        "{query}"
        Provide only the extracted activity and nothing else. dont use acronyms
        """
        response = self.model.generate_content(prompt)
        return response.text.strip()

    def get_relevant(self, query, top_k=10, threshold=0.4):
        """Retrieves the most relevant activities based on the extracted activity."""
        query_embedding = self.pc.inference.embed(
            model="llama-text-embed-v2",
            inputs=[query],
            parameters={"input_type": "query"}
        )

        res = self.index.query(
            namespace="ns1",
            vector=query_embedding[0].values,
            top_k=top_k,
            include_values=False,
            include_metadata=True
        )

        matches = res.get("matches", [])
        filtered_matches = [match for match in matches if match["score"] >= threshold]
        redundant_activities = [int(match["id"]) for match in filtered_matches]

        most_similar = (
            self.real_activities.loc[redundant_activities, "name_activity"].tolist()
            if redundant_activities and self.real_activities is not None
            else ["Aucune activité similaire trouvée."]
        )

        return most_similar

    def search_activity(self, query, top_k=5):
        """Extracts the activity and retrieves similar activities without generating a response."""
        extracted_activity = self.extract_activity(query)
        detected_lang = detect(extracted_activity)
        if detected_lang != "fr":
            extracted_activity = translate(extracted_activity, "fr")

        if not extracted_activity:
            return "Je n'ai pas pu identifier une activité spécifique. Pouvez-vous reformuler votre question ?"
        
        similar_activities = self.get_relevant(extracted_activity, top_k,threshold=0.3)
        return similar_activities
