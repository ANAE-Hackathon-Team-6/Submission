from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
import json
import os
from dotenv import load_dotenv
load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    timeout=60,
    max_retries=5,
)

prompt_template_sub = ChatPromptTemplate.from_messages(
    [
        ("system", "Vous êtes un expert juridique dans la réglementation algérienne des auto-entrepreneurs."),
        ("human", '''
        Pour le domaine : {field}, les sous-domaines sont : {subfields},
        Déterminez quel sous-domaine est le plus pertinent pour l'activité suggérée :
        Nom de l'activité : "{activity_name}"
        Description de l'activité : "{activity_description}"
        
        La sortie doit être dans la même langue que le nom et la description de l'activité fournis.
        Retournez le nom du sous-domaine dans une ligne.
        Dans la ligne suivante, affinez le nom de l'activité et sortez-le (Gardez-le à moins de 8 mots).
        Dans la ligne suivante, affinez la description de l'activité et sortez-la (Gardez-la à moins de 60 mots).
        Ne retournez rien d'autre.
        '''),
    ]
)

def get_subfields_of_field(field):
    return ['Agronomy', 'Astronomy', 'Computer Science', 'Physics']

def get_subcategory(act_name, act_desc, field):
    subfields = get_subfields_of_field(field)
    prompt = prompt_template_sub.invoke({'field': field, 'subfields': subfields, 'activity_name': act_name, 'activity_description': act_desc})
    result = llm.invoke(prompt)
    
    outputs = result.content.split('\n')
    
    return {'subcategory': outputs[0], 'name': outputs[1], 'description': outputs[2]}