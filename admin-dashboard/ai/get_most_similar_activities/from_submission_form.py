


def similar_activities_from_submission_form(title_so_far, description_so_far):
    """
    function to get most similar activities to a prompt.
    """
    most_similar_activities = get_similar_activities(title_so_far, description_so_far)
    return {"most_similar_activities": most_similar_activities}


def get_similar_activities(title_so_far, description_so_far) -> list[str]:
    # Placeholder logic: Randomly assign a list of activities
    most_similar_activities = ["Activity 1", "Activity 2", "Activity 3"]
    return most_similar_activities