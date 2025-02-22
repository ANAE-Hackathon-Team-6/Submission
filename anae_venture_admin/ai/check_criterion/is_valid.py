import json
import pandas as pd
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv

def is_valid_activity(activity, description):
    """
    Function to determine if an activity is approved or rejected.
    Returns a dictionary containing the validation result and explanation.
    """
    is_valid, ai_explanation = check_valid_logic(activity, description)
    return {"is_valid": is_valid, "ai_explanation": ai_explanation}

def check_valid_logic(activity, description) -> tuple[bool, str]:
    """
    Checks if an activity is valid based on defined criteria using the Gemini model.
    Returns a tuple of (is_valid, explanation).
    """
    load_dotenv()
    
    # Initialize the model
    model = ChatGoogleGenerativeAI(
        model="gemini-pro",
        timeout=60,
        max_retries=5,
    )

    criteria = '''
        ---
        
        **Rejection Conditions (The activity will be rejected if it meets ANY of the following):**
            
        **It is eligible for an artisan card** based on the following:  
        - Listed in the official nomenclature of artisanal activities.  
        - Requires manual craftsmanship, artistic creation, or traditional material transformation.  
        - Small-scale, quality-focused, and involves human intervention.  
        - Contributes to cultural or heritage preservation.  
        - Follows environmental sustainability principles.  
        
        **It is eligible for a farmer card** based on the following:  
        - Related to recognized agricultural sectors (crop cultivation, livestock farming, horticulture, agroforestry, etc.).  
        - Structured production cycle (planting, maintenance, harvesting, etc.).  
        - Integrated into local or national supply chains.  
        - Suitable for local climate/ecological conditions.  
        ---
    '''

    prompt_template_messages = [
        ("human", """
        As an expert evaluator of activities based on regulatory criteria:
        
        You will receive an activity suggestion formatted as follows:
        ['Activity':{{}}, 'Description':{{}}]
        
        Possible languages: Arabic, French, and English.
        
        Your task is to **approve or reject** the suggested activity based on the following regulatory criteria:
        {criteria}
        
        **Approval Rule:** 
        - If the activity **does not qualify** for either an artisan or farmer card, then it should be **APPROVED**.  
        
        **Output Format (MUST be JSON)**  
        {{
            "decision": "APPROVED" or "REJECTED",
            "reason": "Detailed explanation for rejection (if applicable) (rejection only, when approving no reason is needed)"
        }}
        
        **Now, evaluate the following activity suggestion:**  
        {activity_suggestion}
        """)
    ]

    prompt_template = ChatPromptTemplate.from_messages(prompt_template_messages)
    activity_suggestion = f"['Activity':{activity}, 'Description':{description}]"
    
    try:
        prompt = prompt_template.invoke({
            "activity_suggestion": activity_suggestion,
            "criteria": criteria,
        })

        result = model.invoke(prompt)

        print('ChatGemini response:', result.content)
        
        # Extract JSON from the response content
        try:
            # Try to parse the content directly
            result_dict = json.loads(result.content)
        except json.JSONDecodeError:
            # If direct parsing fails, try to extract JSON from the markdown code block
            content = result.content
            if "```json" in content and "```" in content:
                json_str = content.split("```json")[1].split("```")[0].strip()
                result_dict = json.loads(json_str)
            else:
                raise ValueError("Could not extract valid JSON from the response")

        decision = result_dict.get("decision", "REJECTED")  # Default to REJECTED if not found
        reason = result_dict.get("reason", "No reason provided")  # Default reason if not found
        
        is_valid = decision == "APPROVED"
        ai_explanation = reason if not is_valid else "Activity approved"
        
        return is_valid, ai_explanation

    except Exception as e:
        print(f"Error processing activity: {str(e)}")
        return False, f"Error processing activity: {str(e)}"

