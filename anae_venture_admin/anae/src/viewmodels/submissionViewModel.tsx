import { useState, useEffect } from "react";
import { fetchSubmissions } from "../data/Submissions";
import { Submission } from "../components/api/submissions/fetchSubmissions";

export type SortOrder = "asc" | "desc";

const pageSize = 10;

export const useSubmissionsViewModel = () => {
  const [selectedTab, setSelectedTab] = useState<"Processed" | "Pending">(
    "Pending"
  );
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [sortField, setSortField] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showRedundant, setShowRedundant] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchSubmissions(selectedTab, showRedundant);

      let filtered = data; // Use API-filtered results directly

      if (keyword) {
        filtered = filtered.filter(
          (s) =>
            s.submissionId.toLowerCase().includes(keyword.toLowerCase()) ||
            s.activityName.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      if (dateFrom) {
        filtered = filtered.filter(
          (s) => new Date(s.date) >= new Date(dateFrom)
        );
      }
      if (dateTo) {
        filtered = filtered.filter((s) => new Date(s.date) <= new Date(dateTo));
      }
      if (category) {
        filtered = filtered.filter((s) => s.category === category);
      }

      // Sorting logic remains unchanged
      filtered.sort((a, b) => {
        let valA = a[sortField as keyof Submission];
        let valB = b[sortField as keyof Submission];

        if (sortField === "date") {
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
        } else {
          valA = typeof valA === "string" ? valA.toLowerCase() : valA;
          valB = typeof valB === "string" ? valB.toLowerCase() : valB;
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });

      setTotalPages(Math.ceil(filtered.length / pageSize));
      const start = (currentPage - 1) * pageSize;
      setSubmissions(filtered.slice(start, start + pageSize));
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchData();
  }, [
    keyword,
    dateFrom,
    dateTo,
    category,
    sortField,
    sortOrder,
    currentPage,
    selectedTab,
    showRedundant,
  ]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  return {
    submissions,
    loading,
    keyword,
    setKeyword,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    category,
    setCategory,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    showRedundant,
    setShowRedundant,
    selectedTab,
    setSelectedTab,
    handleSort,
    handleSearch,
  };
};
