import pandas as pd
from pinecone import Pinecone, ServerlessSpec
import google.generativeai as genai
from langdetect import detect

from mtranslate import translate

class ConversationalAI:
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

        # Initialize Google Gemini AI
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel('gemini-pro')

        # Define response template
        self.template = """
        Vous êtes un assistant IA conçu pour optimiser l’évaluation des suggestions d’activités pour les auto-entrepreneurs en Algérie.  

        - Identifiez et supprimez les suggestions en double.  
        Activités similaires si elles existent : {0}  
        Suggestion d’activité de l’utilisateur : {1}.  

        Indiquez s'il y a une redondance ou non, avec les activités similaires si elles existent.  
        """

        # Initialize conversation history
        self.history = []
    
    def extract_activity(self, query):
        """Extracts the activity from the user's query using Gemini AI."""
        prompt = f"""
        Extract the main business activity mentioned in the following user query:
        "{query}"
        Provide only the extracted activity and nothing else dont give acronyms
        
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

        return len(redundant_activities) > 0, most_similar, redundant_activities

    def get_answer(self, query, top_k=5):
        """Extracts the activity, checks redundancy, and generates a response."""
        detected_lang = detect(query)
        if detected_lang != "fr":
            query = translate(query, "fr")

        extracted_activity = self.extract_activity(query)
        if not extracted_activity:
            return "Je n'ai pas pu identifier une activité spécifique. Pouvez-vous reformuler votre question ?"

        is_redundant, most_similar, _ = self.get_relevant(extracted_activity, top_k, threshold=0.3)
        if not is_redundant:
            return "Il n'y a pas de redondance."

        context = "\n".join(self.history[-10:])
        input_text = f"{context}\n\n" + self.template.format("\n".join(most_similar), extracted_activity)
        ans = self.model.generate_content(input_text)

        self.history.append(f"Utilisateur: {query}")
        self.history.append(f"Chatbot: {ans.text}")

        return ans.text

    def conversational_ai(self, query):
        """Processes user queries and returns a response."""
        return self.get_answer(query)

# Example usage

