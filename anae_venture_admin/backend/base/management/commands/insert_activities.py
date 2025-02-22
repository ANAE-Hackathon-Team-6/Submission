import csv
import os
import random
from django.core.management.base import BaseCommand
from base.models import Activity


class Command(BaseCommand):
    help = "Insert activities from a CSV file into the database"

    def add_arguments(self, parser):
        parser.add_argument(
            "csv_file",
            type=str,
            help="Path to the CSV file containing activities data",
            default="/backend/data/activity.csv",
        )

    def handle(self, *args, **options):
        csv_file_path = options["csv_file"]

        # Check if the file exists
        if not os.path.exists(csv_file_path):
            self.stdout.write(self.style.ERROR(f"File not found: {csv_file_path}"))
            return

        # Define random choices for diversity
        bool_choices = [True, False]
        explanation_choices = [
            "Activity is valid and correctly classified.",
            "Activity is redundant.",
            "Activity requires human review.",
            "Activity is invalid due to incorrect categorization.",
        ]
        most_similar_choices = ["Activity A", "Activity B", "Activity C", "Activity D"]

        # Read and insert data from CSV
        with open(csv_file_path, newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Generate random values
                is_valid = random.choice(bool_choices)
                is_redundant = random.choice(bool_choices)
                is_redundant_among_history = random.choice(bool_choices)
                is_processed_by_human = random.choice(bool_choices)
                most_similar = random.choices(
                    most_similar_choices, k=random.randint(0, 3)
                )
                ai_explanation = random.choice(explanation_choices)

                redundant_activities = [
                    random.randint(1, 3) for _ in range(random.randint(0, 3))
                ]
                redundant_activities_among_history = [
                    random.randint(1, 3) for _ in range(random.randint(0, 3))
                ]

                # Insert or update the activity
                activity, created = Activity.objects.get_or_create(
                    code_pro=row["code_pro"],
                    wilaya=row["wilaya"],
                    field=row["field"] if row["field"] else None,
                    activity=row["activity"],
                    description=row["description"],
                    user_id=1,
                    defaults={
                        "meta_ai": {
                            "is_valid": is_valid,
                            "is_rundandant": is_redundant,
                            "is_rundandant_among_history": is_redundant_among_history,
                            "most_similar": most_similar,
                            "ai_explanation": ai_explanation,
                            "redundant_activities": redundant_activities,
                            "redundant_activities_among_history": redundant_activities_among_history,
                            "is_processed_by_human": is_processed_by_human,
                            "description_refined": "",
                            "activity__name_refined": "",
                        }
                    },
                )

                if created:
                    self.stdout.write(
                        self.style.SUCCESS(f"Inserted: {row['activity']}")
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(f"Already exists: {row['activity']}")
                    )
