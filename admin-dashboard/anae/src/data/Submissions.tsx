import { API_URL } from "../components/api/config";

export interface Submission {
  id: number;
  submissionId: string;
  date: string;
  wilaya: string;
  activityName: string;
  category: string;
  processed: "Processed" | "Pending";
  is_valid_ai: boolean;
  why_valid_ai: string;
  is_redundant_ai: boolean;
  why_redundant_ai: string;
  is_valid_human: boolean;
  is_redundant_human: boolean;
  description: string;
  most_similar_submissions: Submission[];
  most_similar_submissions_count: number;
}

export async function fetchSubmissions(
  status: "Processed" | "Pending",
  showRedundant: boolean
): Promise<Submission[]> {
  const processedByHuman = status === "Processed" ? "true" : "false"; // Convert tab selection to query param

  // Build the query parameters dynamically

  let query = `is_redundant_among_history=${showRedundant}&page_size=100`;
  query += `&processed_by_human=${processedByHuman}`;
  const url = `${API_URL}?${query}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch submissions");
  }

  const data = await response.json();
  console.log("API Response:", data);

  // Map API activity data to our Submission interface.
  return data.activities.map((act: any) => ({
    id: act.id,
    submissionId: act.code_pro,
    date: act.created_at,
    wilaya: act.wilaya,
    activityName: act.activity,
    category: act.field,
    processed: act.meta_ai.is_valid ? "Processed" : "Pending",
    is_valid_ai: act.meta_ai.is_valid,
    why_valid_ai: act.meta_ai.ai_explanation || "",
    is_redundant_ai: act.meta_ai.is_rundandant,
    why_redundant_ai:
      act.meta_ai.redundant_activities &&
      act.meta_ai.redundant_activities.length > 0
        ? act.meta_ai.redundant_activities.join(", ")
        : "",
    is_valid_human: false,
    is_redundant_human: false,
    description: act.description,
    most_similar_submissions: [],
    most_similar_submissions_count: act.meta_ai.redundant_activities
      ? act.meta_ai.redundant_activities.length
      : 0,
  }));
}
