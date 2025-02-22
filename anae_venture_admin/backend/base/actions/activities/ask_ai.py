import requests


def ask_ai(activity_id, activity, description, field):
    """Make a request to an external AI server using the provided parameters.

    Parameters:
        activity (str): The activity value.
        description (str): The description of the activity.
        field (str): The field associated with the activity.

    Returns:
        dict: A dictionary containing the AI server's JSON response.
    """
    url = "http://localhost:5000/evaluate"  # Replace with the actual AI server URL

    payload = {
        "activity_id": activity_id,
        "activity": activity,
        "description": description,
        "field": field,
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Raises an error for 4xx/5xx responses
        return response.json()  # Return the JSON response from the AI server

    except requests.exceptions.RequestException as e:
        return {"error": str(e)}


def transform_ai_response(ai_response):
    """
    Transforms the AI response to match the desired `meta_ai` format.
    If the AI service returned an error, a placeholder response is returned.

    Parameters:
        ai_response (dict): The original AI response.

    Returns:
        dict: Transformed response matching `meta_ai` format.
    """
    if "error" in ai_response:
        # Return a placeholder response when an error is encountered.
        return {
            "is_valid": False,
            "is_rundandant_among_history": False,
            "most_similar": [],
            "ai_explanation": "Placeholder: AI service error",
            "redundant_activities": [],
            "redundant_activities_among_history": [],
            "is_processed_by_human": False,
            "sub_category": "",
            "description_refined": "Placeholder description",
            "activity_name_refined": "Placeholder activity",
        }

    return {
        "is_valid": ai_response.get("is_valid", False),
        "is_rundandant_among_history": ai_response.get(
            "is_redundant_among_history", False
        ),
        "most_similar": ai_response.get("most_similar", ""),
        "ai_explanation": ai_response.get("ai_explanation", ""),
        "redundant_activities": ai_response.get(
            "redundant_activities", []
        ),  # Already in ID format
        "redundant_activities_among_history": ai_response.get(
            "redundant_activities_among_history", []
        ),  # Already in ID format
        "is_processed_by_human": False,  # Since we got a response
        "sub_category": ai_response.get("sub_category", ""),
        "description_refined": None,
        "activity_name_refined": None,
    }
