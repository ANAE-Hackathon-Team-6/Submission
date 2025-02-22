"""views.py
Handles filtering of Activity objects based on AI and human metadata.
"""

from django.http import JsonResponse
from base.models import Activity


def parse_boolean(value):
    """Converts string values "true" or "false" to boolean, returns None if invalid."""
    return (
        value.lower() == "true"
        if value and value.lower() in ["true", "false"]
        else None
    )


def filter_activities(request):
    """Filters activities based on AI and human metadata boolean fields."""

    filter_fields = {
        "ai_valid": "meta_ai__is_valid",
        "ai_rundandant": "meta_ai__is_rundandant",
        "processed": "meta_ai__processed",
    }

    filters = {
        db_field: parsed_value
        for param, db_field in filter_fields.items()
        if (parsed_value := parse_boolean(request.GET.get(param))) is not None
    }

    activities = Activity.objects.filter(**filters).values(
        "id",
        "code_pro",
        "wilaya",
        "field",
        "activity",
        "description",
        "meta_ai",
        "meta_human",
    )

    return JsonResponse({"activities": list(activities)})
