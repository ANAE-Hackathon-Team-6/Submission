import csv
import json

from celery import shared_task
from channels_redis.core import RedisChannelLayer
from asgiref.sync import async_to_sync

from base.models import Activity  # adjust the import as needed
from base.actions.activities import (
    ask_ai,
    post_process_ai,
)


@shared_task
def process_csv_task(file_path, user_id):
    """
    Processes a CSV file containing activities. For each row in the CSV,
    an Activity record is created, validated with an AI service, optionally
    refined if valid, and then saved. Progress messages are sent via Channels.

    CSV format: code_pro,wilaya,field,activity,description
    """
    # Set up the Redis channel layer for sending progress updates
    channel_layer = RedisChannelLayer(hosts=[{"address": "redis://localhost:6379/0"}])
    async_to_sync(channel_layer.group_send)(
        "file_process_group",
        {
            "type": "send_message",
            "message": f"Started processing CSV file: {file_path}",
        },
    )

    try:
        with open(file_path, newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Extract required fields from the CSV row
                code_pro = row.get("code_pro")
                wilaya = row.get("wilaya")
                field_val = row.get("field")
                activity_val = row.get("activity")
                description = row.get("description")

                # Check for missing required fields
                if not all([code_pro, wilaya, field_val, activity_val, description]):
                    async_to_sync(channel_layer.group_send)(
                        "file_process_group",
                        {
                            "type": "send_message",
                            "message": f"Skipping row due to missing fields: {row}",
                        },
                    )
                    continue

                # Create an Activity record
                activity = Activity.objects.create(
                    code_pro=code_pro,
                    wilaya=wilaya,
                    field=field_val,
                    activity=activity_val,
                    description=description,
                    user_id=1,
                )
                async_to_sync(channel_layer.group_send)(
                    "file_process_group",
                    {
                        "type": "send_message",
                        "message": f"Created activity ID: {activity.id}",
                        "id": activity.id,
                    },
                )

                # Call the AI service to validate the activity
                ai_response = ask_ai.ask_ai(
                    activity.id, activity_val, description, field_val
                )
                if "error" in ai_response:
                    async_to_sync(channel_layer.group_send)(
                        "file_process_group",
                        {
                            "type": "send_message",
                            "message": f"AI error for activity ID {activity.id}: {ai_response.get('error')}",
                            "id": activity.id,
                        },
                    )
                    continue

                # Store the raw AI response
                activity.meta_ai = ai_response

                # If valid and not redundant, refine the description and activity name
                if ai_response.get("is_valid") and not ai_response.get("is_rundandant"):
                    refined_data = post_process_ai.post_process_ai(
                        activity_val, description, field_val
                    )
                    refined_meta = {
                        **ai_response,
                        "refined_description": refined_data.get("description"),
                        "refined_activity_name": refined_data.get("name"),
                    }
                    activity.sub_category = refined_data.get("sub_category", "")
                    activity.meta_ai = refined_meta

                # Save the updated Activity record
                activity.save()
                async_to_sync(channel_layer.group_send)(
                    "file_process_group",
                    {
                        "type": "send_message",
                        "message": f"Processed activity ID: {activity.id}",
                        "id": activity.id,
                    },
                )
    except Exception as e:
        async_to_sync(channel_layer.group_send)(
            "file_process_group",
            {
                "type": "send_message",
                "message": f"Error processing CSV file {file_path}: {str(e)}",
            },
        )

    async_to_sync(channel_layer.group_send)(
        "file_process_group",
        {"type": "send_message", "message": f"Processing completed for {file_path}"},
    )

    return "Processing Completed Succesfully"
