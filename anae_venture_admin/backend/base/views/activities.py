from django.http import JsonResponse
from django.views import View
from django.shortcuts import get_object_or_404
import json
from base.actions.activities.post_process_ai import post_process_ai
from base.models import Activity
from base.actions.activities.ask_ai import ask_ai
from django.forms.models import model_to_dict
from django.core.paginator import Paginator


def parse_boolean(value):
    """Converts string values "true" or "false" to boolean, returns None if invalid."""
    return (
        value.lower() == "true"
        if value and value.lower() in ["true", "false"]
        else None
    )


class ActivityAPIView(View):
    """Handles Activity operations including filtering, AI simulation, updating, and deleting."""

    def get(self, request, activity_id=None):
        """Retrieve an activity by ID or filter activities with pagination."""
        if activity_id:
            activity = get_object_or_404(Activity, id=activity_id)
            activity_data = model_to_dict(activity)

            # Fetch redundant activities
            redundant_activity_ids = activity.meta_ai.get("redundant_activities", [])
            redundant_activities_among_history = activity.meta_ai.get(
                "redundant_activities_among_history", []
            )
            redundant_activities = list(
                Activity.objects.filter(id__in=redundant_activity_ids).values()
            )
            redundant_activities_among_history = list(
                Activity.objects.filter(
                    id__in=redundant_activities_among_history
                ).values()
            )
            activity_data["redundant_activities"] = redundant_activities
            activity_data["redundant_activities_among_history"] = (
                redundant_activities_among_history
            )

            return JsonResponse(activity_data)

        # ✅ Define filtering options for meta_ai fields
        filter_fields = {
            "is_valid": "meta_ai__is_valid",
            "is_redundant": "meta_ai__is_rundandant",
            "is_redundant_among_history": "meta_ai__is_rundandant_among_history",
            "processed_by_human": "meta_ai__is_processed_by_human",
            "description_refined": "meta_ai__description_refined",
            "activity_name_refined": "meta_ai__activity__name_refined",
        }

        filters = {}

        # ✅ Apply filtering logic
        for param, db_field in filter_fields.items():
            value = request.GET.get(param)
            if value is not None:
                if param in [
                    "is_valid",
                    "is_redundant",
                    "is_redundant_among_history",
                    "processed_by_human",
                ]:
                    filters[db_field] = parse_boolean(value)
                else:
                    filters[db_field] = value  # Direct string filtering

        # ✅ Additional filters
        if request.GET.get("has_redundant"):
            if parse_boolean(request.GET["has_redundant"]):
                filters["meta_ai__redundant_activities__len__gt"] = 0

        if request.GET.get("has_redundant_history"):
            if parse_boolean(request.GET["has_redundant_history"]):
                filters["meta_ai__redundant_activities_among_history__len__gt"] = 0

        if request.GET.get("most_similar"):
            most_similar_activity = request.GET["most_similar"]
            filters["meta_ai__most_similar__icontains"] = most_similar_activity

        if request.GET.get("ai_explanation_contains"):
            explanation = request.GET["ai_explanation_contains"]
            filters["meta_ai__ai_explanation__icontains"] = explanation

        # ✅ Pagination handling
        page = request.GET.get("page", 1)
        page_size = request.GET.get("page_size", 10)

        try:
            page = int(page)
            page_size = int(page_size)
        except ValueError:
            return JsonResponse({"error": "Invalid page or page_size"}, status=400)

        # ✅ Query & pagination
        activities_qs = Activity.objects.filter(**filters).order_by(
            "-created_at"
        )  # Sort by newest
        paginator = Paginator(activities_qs, page_size)

        try:
            activities = paginator.page(page)
        except Exception:
            return JsonResponse({"error": "Invalid page number"}, status=400)

        return JsonResponse(
            {
                "activities": list(activities.object_list.values()),
                "total_pages": paginator.num_pages,
                "total_activities": paginator.count,
                "current_page": activities.number,
                "page_size": page_size,
                "has_next": activities.has_next(),
                "has_previous": activities.has_previous(),
            }
        )

    def post(self, request, activity_id=None):
        try:
            # Parse JSON request data
            data = json.loads(request.body)

            # Extract required fields
            activity_val = data.get("activity")
            description = data.get("description")
            field_val = data.get("field")
            code_pro = data.get("code_pro")
            wilaya = data.get("wilaya")
            user_id = data.get("user_id")

            if not all(
                [activity_val, description, field_val, code_pro, wilaya, user_id]
            ):
                return JsonResponse(
                    {
                        "error": "Missing required fields: activity, description, field, code_pro, wilaya, user_id"
                    },
                    status=400,
                )
            activity = Activity.objects.create(
                code_pro=code_pro,
                wilaya=wilaya,
                field=field_val,
                activity=activity_val,
                description=description,
                user_id=user_id,
            )

            # Call AI service to validate activity
            ai_response = ask_ai(activity.id, activity_val, description, field_val)

            if "error" in ai_response:
                return JsonResponse({"error": ai_response["error"]}, status=500)

            # Extract and remove sub_category from AI response

            activity.meta_ai = ai_response

            # If valid and not redundant, refine description and activity
            if ai_response.get("is_valid") and not ai_response.get("is_rundandant"):
                print("Refining activity and description...")
                refined_data = post_process_ai(activity_val, description, field_val)

                data = {
                    **ai_response,
                    "refined_description": refined_data["description"],
                    "refined_activity_name": refined_data["name"],
                }

                # Create new Activity record
                activity.sub_category = refined_data.get("sub_category", "")
                activity.meta_ai = data

                # Save changes to the database
                activity.save()

            # Return the updated activity object
            return JsonResponse(model_to_dict(activity), status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    def put(self, request, activity_id=None):
        """Updates an existing Activity and returns the updated instance."""
        if not activity_id:
            return JsonResponse(
                {"error": "Activity ID is required for update"}, status=400
            )

        activity = get_object_or_404(Activity, id=activity_id)
        try:
            data = json.loads(request.body)
            for field in [
                "code_pro",
                "wilaya",
                "field",
                "sub_category",
                "activity",
                "description",
            ]:
                if field in data:
                    setattr(activity, field, data[field])
            activity.save()

            return JsonResponse(model_to_dict(activity))

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    def delete(self, request, activity_id=None):
        """Deletes an Activity and returns the deleted instance."""
        if not activity_id:
            return JsonResponse(
                {"error": "Activity ID is required for deletion"}, status=400
            )

        activity = get_object_or_404(Activity, id=activity_id)
        activity_data = model_to_dict(activity)  # Store before deletion
        activity.delete()

        return JsonResponse(model_to_dict(activity_data), status=204)
