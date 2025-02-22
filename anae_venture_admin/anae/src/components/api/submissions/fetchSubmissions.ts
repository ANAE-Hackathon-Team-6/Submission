export async function fetchSubmissions(
  page: number,
  pageSize: number,
  sortField: string,
  sortOrder: string,
  keyword: string,
  dateFrom: string,
  dateTo: string,
  category: string,
  showRedundant: boolean,
  selectedTab: "Processed" | "Pending"
): Promise<{
  submissions: Submission[];
  totalPages: number;
  currentPage: number;
}> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort_field: sortField,
    sort_order: sortOrder,
    keyword,
    date_from: dateFrom,
    date_to: dateTo,
    category,
    show_redundant: showRedundant.toString(),
    processed: selectedTab === "Processed" ? "true" : "false",
  });

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch submissions");
  }

  const data = await response.json();
  console.log(data);

  return {
    submissions: data.activities.map((act: any) => ({
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
    })),
    totalPages: data.total_pages,
    currentPage: data.current_page,
  };
}
