import requests


def post_process_ai(activity, description, field):
    """
    Sends a request to an AI service to refine activity and description.

    Parameters:
        activity (str): The activity value.
        description (str): The description of the activity.
        field (str): The field associated with the activity.

    Returns:
        dict: A dictionary containing the refined description and activity name.
    """
    url = "http://localhost:5000/get_subcategory_and_refine"  # Adjust to match your actual endpoint

    payload = {
        "activity": activity,
        "description": description,
        "field": field,
    }
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Raises an error for 4xx/5xx responses
        refined_data = response.json()

        return refined_data

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")  # Log the error
