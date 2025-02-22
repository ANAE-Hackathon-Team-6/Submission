import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { API_URL } from "../components/api/config";

export const useSubmissionDetailViewModel = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchSubmission = async () => {
    setLoading(true);
    setError("");

    const url = `${API_URL}${id}/`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch submission details.");
      }

      const act = await response.json();

      // Find the activity by ID

      if (!act) {
        throw new Error("Submission not found.");
      }

      // Base submission object (without meta_ai)
      const baseSubmission: Submission = {
        id: act.id,
        submissionId: act.code_pro,
        date: act.created_at,
        wilaya: act.wilaya,
        activityName: act.activity,
        category: act.field || "Uncategorized",
        refinedActivityName: act.refined_activity || act.activity, // Capture refined name
        refinedDescription: act.refined_description || act.description, // Capture refined description
        description: act.description || "No description available.",
      };

      // Check if `meta_ai` exists before adding AI-related fields
      if (act.meta_ai) {
        baseSubmission.processed = act.meta_ai.is_processed_by_human
          ? "Processed"
          : "Pending";
        baseSubmission.is_valid_ai = act.meta_ai.is_valid;
        baseSubmission.why_valid_ai =
          act.meta_ai.ai_explanation || "No explanation provided.";
        baseSubmission.is_redundant_ai =
          act.meta_ai.is_rundandant_among_history || false;
        baseSubmission.why_redundant_ai =
          act.meta_ai.redundant_activities?.length > 0
            ? `Redundant with IDs: ${act.meta_ai.redundant_activities.join(
                ", "
              )}`
            : "Not redundant.";
        baseSubmission.is_valid_human =
          act.meta_ai.is_processed_by_human || false;
        baseSubmission.is_redundant_human =
          act.meta_ai.is_rundandant_among_history || false;
        baseSubmission.most_similar_submissions =
          act.meta_ai.most_similar || [];
        baseSubmission.most_similar_submissions_count =
          act.meta_ai.most_similar?.length || 0;
        baseSubmission.redundant_activities =
          act.meta_ai.redundant_activities || [];
        baseSubmission.redundant_activities_among_history =
          act.meta_ai.redundant_activities_among_history || [];
        baseSubmission.refined_description = act.meta_ai.refined_description;
        baseSubmission.refined_activity = act.meta_ai.refined_activity_name;
        baseSubmission.sub_category = act.meta_ai.sub_category;
      }
      setSubmission(baseSubmission);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  return { submission, loading, error, setSubmission };
};
