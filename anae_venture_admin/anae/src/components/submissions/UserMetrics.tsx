import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";

export default function EcommerceMetrics() {
  const [metrics, setMetrics] = useState({
    suggestions: { count: 20, percentage: 1 },
    pendingReviews: { count: 10, percentage: 1 },
    users: { count: 100, percentage: 5 },
  });

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/metrics");
        const data = await response.json();
        setMetrics({
          suggestions: {
            count: data.suggestionsCount,
            percentage: data.suggestionsPercentage,
          },
          pendingReviews: {
            count: data.pendingReviewsCount,
            percentage: data.pendingReviewsPercentage,
          },
          users: {
            count: data.usersCount,
            percentage: data.usersPercentage,
          },
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <div className="flex gap-4">
      {/* Metric Item: Suggestions submitted */}
      <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Suggestions submitted
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.suggestions.count.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {metrics.suggestions.percentage}%
          </Badge>
        </div>
      </div>

      {/* Metric Item: Pending Reviews */}
      <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pending reviews
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.pendingReviews.count.toLocaleString()}
            </h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon />
            {metrics.pendingReviews.percentage}%
          </Badge>
        </div>
      </div>

      {/* Metric Item: Users */}
      <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {/* You can choose a different icon for Users if available */}
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.users.count.toLocaleString()}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {metrics.users.percentage}%
          </Badge>
        </div>
      </div>
    </div>
  );
}
