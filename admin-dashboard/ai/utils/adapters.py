def adapt_response(original_response):
    """Convert original response to the new format."""
    return {
        "is_valid": original_response.get("is_valid", False),
        "is_rundandant_among_history": original_response.get("redundant", False),
        "most_similar": original_response.get("most_similar", []),
        "ai_explanation": original_response.get(
            "ai_explanation", "Placeholder: AI service error"
        ),
        "redundant_activities": original_response.get("redundant_activities", []),
        "redundant_activities_among_history": original_response.get(
            "similar_activities", []
        ),
        "is_processed_by_human": False,
        "sub_category": "",
        "description_refined": "Placeholder description",
        "activity_name_refined": "Placeholder activity",
    }
