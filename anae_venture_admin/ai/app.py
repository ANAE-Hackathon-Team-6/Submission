from flask import Flask, request, jsonify

from utils.adapters import adapt_response
from check_criterion.is_valid import is_valid_activity
from check_redundant.is_redundant import is_redundant
from check_redundant.is_redundant_among_history import is_redundant_among_history
from classify_subcategory.subcateg import get_subcategory
from chatbot.chatbot import ConversationalAI
from search.search import SearchAI
from searchNoAI.search import Search
from get_most_similar_activities.from_prompt import get_similar_activities_from_prompt
from get_most_similar_activities.from_submission_form import (
    similar_activities_from_submission_form,
)
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/evaluate", methods=["POST"])
def evaluate():
    data = request.get_json()
    if (
        not data
        or "activity" not in data
        or "description" not in data
        or "activity_id" not in data
    ):
        return (
            jsonify(
                {
                    "error": "Invalid input. Provide 'Activity' , Activity Id and 'Description'."
                }
            ),
            400,
        )

    result = is_valid_activity(data["activity"], data["description"])
    result.update(is_redundant(data["activity"], data["description"]))
    result.update(
        is_redundant_among_history(
            data["activity_id"], data["activity"], data["description"]
        )
    )

    result = adapt_response(result)
    return jsonify(result)


@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    if not data or "Query" not in data:
        return jsonify({"error": "Invalid input. Provide 'Query'."}), 400

    pinecone_api_key = (
        "pcsk_34KbSm_2WQhegrRfgD8uQjoUw8VNgjXhfgWxqA7KLMGZaqNjCB5XiDvjrdMkgasYhrWtZD"
    )
    gemini_api_key = "AIzaSyAAH27cavT1ruEbeFWDpNXMfqazy41m4F0"
    real_activities_path = "./check_redundant/activities_with_definitions (2).csv"

    chatbot = ConversationalAI(
        pinecone_api_key, gemini_api_key, real_activities_path=real_activities_path
    )
    response = chatbot.conversational_ai(data["Query"])

    return jsonify(response)


@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    if not data or "Query" not in data:
        return jsonify({"error": "Invalid input. Provide 'Query'."}), 400

    pinecone_api_key = (
        "pcsk_34KbSm_2WQhegrRfgD8uQjoUw8VNgjXhfgWxqA7KLMGZaqNjCB5XiDvjrdMkgasYhrWtZD"
    )
    gemini_api_key = "AIzaSyAAH27cavT1ruEbeFWDpNXMfqazy41m4F0"
    real_activities_path = "./check_redundant/activities_with_definitions (2).csv"

    searchbot = SearchAI(
        pinecone_api_key, gemini_api_key, real_activities_path=real_activities_path
    )
    response = searchbot.search_activity(data["Query"])

    return jsonify(response)


@app.route("/searchnoai", methods=["POST"])
def searchnoai():
    data = request.get_json()
    if not data or "Query" not in data:
        return jsonify({"error": "Invalid input. Provide 'Query'."}), 400

    pinecone_api_key = (
        "pcsk_34KbSm_2WQhegrRfgD8uQjoUw8VNgjXhfgWxqA7KLMGZaqNjCB5XiDvjrdMkgasYhrWtZD"
    )
    gemini_api_key = "AIzaSyAAH27cavT1ruEbeFWDpNXMfqazy41m4F0"
    real_activities_path = "./check_redundant/activities_with_definitions (2).csv"

    searchbot = Search(
        pinecone_api_key, gemini_api_key, real_activities_path=real_activities_path
    )
    response = searchbot.search_activity(data["Query"])

    return jsonify(response)


@app.route("/get_subcategory_and_refine", methods=["POST"])
def get_subcategory_and_refine():
    data = request.get_json()
    if (
        not data
        or "activity" not in data
        or "description" not in data
        or "field" not in data
    ):
        return (
            jsonify(
                {
                    "error": "Invalid input. Provide 'Activity', 'Description', and 'Field'."
                }
            ),
            400,
        )

    return jsonify(
        get_subcategory(data["activity"], data["description"], data["field"])
    )


@app.route("/get_similar_activities", methods=["POST"])
def get_similar_activities():
    data = request.get_json()
    if not data or "Prompt" not in data:
        return jsonify({"error": "Invalid input. Provide 'Prompt'."}), 400

    return jsonify(get_similar_activities_from_prompt(data["Prompt"]))


@app.route("/get_similar_activities_from_submission_form", methods=["POST"])
def get_similar_activities_from_submission_form():
    data = request.get_json()
    if not data or "TitleSoFar" not in data or "DescriptionSoFar" not in data:
        return (
            jsonify(
                {"error": "Invalid input. Provide 'TitleSoFar' and 'DescriptionSoFar'."}
            ),
            400,
        )

    return jsonify(
        similar_activities_from_submission_form(
            data["TitleSoFar"], data["DescriptionSoFar"]
        )
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
