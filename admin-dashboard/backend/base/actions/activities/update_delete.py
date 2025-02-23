"""views.py
Handles updating and deleting Activity objects.
"""

from django.http import JsonResponse

from django.shortcuts import get_object_or_404
import json
from base.models import Activity


def update_activity(request, activity_id):
    """Updates an activity with new data.

    Accepts a PUT request with a JSON payload containing fields to update.

    Example:
    {
        "code_pro": "new_code",
        "wilaya": "new_wilaya",
        "field": "new_field",
        "activity": "new_activity",
        "description": "updated description",
        "meta_ai": {"is_valid": true, "is_rundandant": false},
        "meta_human": {"is_valid": false, "is_rundandant": true}
    }
    """
    if request.method != "PUT":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    activity = get_object_or_404(Activity, id=activity_id)

    try:
        data = json.loads(request.body)

        """Update only provided fields"""
        for field in [
            "code_pro",
            "wilaya",
            "field",
            "activity",
            "description",
            "meta_ai",
            "meta_human",
        ]:
            if field in data:
                setattr(activity, field, data[field])

        activity.save()

        return JsonResponse({"message": "Activity updated successfully"})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)


def delete_activity(request, activity_id):
    """Deletes an activity based on its ID.

    Accepts only DELETE requests.
    """
    if request.method != "DELETE":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    activity = get_object_or_404(Activity, id=activity_id)
    activity.delete()

    return JsonResponse({"message": "Activity deleted successfully"})
