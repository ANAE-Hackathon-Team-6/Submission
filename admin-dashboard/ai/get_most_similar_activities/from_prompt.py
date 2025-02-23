




def get_similar_activities_from_prompt(prompt):
    """
    function to get most similar activities to a prompt.
    """
    most_similar_activities = get_similar_activities(prompt)
    return {"most_similar_activities": most_similar_activities}


def get_similar_activities(prompt) -> list[str]:

    # Placeholder logic: Randomly assign a list of activities
    most_similar_activities = ["Activity 1", "Activity 2", "Activity 3"]
    return most_similar_activities