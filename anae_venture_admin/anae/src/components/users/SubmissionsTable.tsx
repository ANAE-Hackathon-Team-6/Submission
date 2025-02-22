import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import FilterBar from "./FilterBar";
import Pagination from "./Pagination";
import { useSubmissionsViewModel } from "../../viewmodels/submissionViewModel";

export default function SubmissionsTable() {
  const {
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
    sortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    showRedundant,
    setShowRedundant,
    selectedTab,
    setSelectedTab,
    handleSort,
    handleSearch,
  } = useSubmissionsViewModel();
  const navigate = useNavigate();
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Tab Selector */}
      <div className="flex w-full p-4 border-b border-gray-100 dark:border-white/[0.05]">
        <button
          type="button"
          onClick={() => setSelectedTab("Pending")}
          className={`flex-1 px-4 py-2 rounded ${
            selectedTab === "Pending"
              ? "bg-success-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setSelectedTab("Processed")}
          className={`flex-1 px-4 py-2 rounded ml-2 ${
            selectedTab === "Processed"
              ? "bg-success-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Processed
        </button>
      </div>

      <div className="flex items-center p-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="flex-1">
          <FilterBar
            keyword={keyword}
            setKeyword={setKeyword}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            category={category}
            setCategory={setCategory}
            onSearch={handleSearch}
          />
        </div>
        <button
          onClick={() => setShowRedundant(!showRedundant)}
          className="px-4 py-2 ml-4 text-white rounded bg-success-600"
        >
          {showRedundant ? "See All" : "See Redundant"}
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSort("submissionId")}
                  >
                    Submission ID
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Date
                  </div>
                </TableCell>
                {/* Wilaya Column */}
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Wilaya
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSort("activityName")}
                  >
                    Activity Name
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    Category
                  </div>
                </TableCell>
                {selectedTab === "Pending" ? (
                  <>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      AI Valid
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      AI Redundant
                    </TableCell>
                  </>
                ) : (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Admin Valid
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="text-gray-500 text-start text-theme-xs dark:text-gray-400 divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={selectedTab === "Pending" ? 8 : 7}
                    className="py-4 text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : submissions.length > 0 ? (
                submissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell className="px-5 py-4 text-start">
                      <div
                        onClick={() =>
                          navigate(`/submissions/${submission.id}`)
                        }
                      >
                        {submission.submissionId}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div
                        onClick={() =>
                          navigate(`/submissions/${submission.id}`)
                        }
                      >
                        {new Date(submission.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    {/* Wilaya Cell */}
                    <TableCell className="px-5 py-4 text-start">
                      <div
                        onClick={() =>
                          navigate(`/submissions/${submission.id}`)
                        }
                      >
                        {submission.wilaya}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div
                        onClick={() =>
                          navigate(`/submissions/${submission.id}`)
                        }
                      >
                        {submission.activityName}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div
                        onClick={() =>
                          navigate(`/submissions/${submission.id}`)
                        }
                      >
                        {submission.category}
                      </div>
                    </TableCell>
                    {selectedTab === "Pending" ? (
                      <>
                        <TableCell className="px-5 py-4 text-start">
                          <div
                            onClick={() =>
                              navigate(`/submissions/${submission.id}`)
                            }
                          >
                            <Badge
                              size="sm"
                              color={
                                submission.is_valid_ai ? "success" : "error"
                              }
                            >
                              {submission.is_valid_ai ? "Valid" : "Invalid"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div
                            onClick={() =>
                              navigate(`/submissions/${submission.id}`)
                            }
                          >
                            <Badge
                              size="sm"
                              color={
                                submission.is_redundant_ai ? "error" : "success"
                              }
                            >
                              {submission.is_redundant_ai
                                ? "Redundant"
                                : "Not Redundant"}
                            </Badge>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <TableCell className="px-5 py-4 text-start">
                        <div
                          onClick={() =>
                            navigate(`/submissions/${submission.id}`)
                          }
                        >
                          <Badge
                            size="sm"
                            color={
                              submission.is_valid_human ? "success" : "error"
                            }
                          >
                            {submission.is_valid_human ? "Valid" : "Invalid"}
                          </Badge>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={selectedTab === "Pending" ? 8 : 7}
                    className="py-4 text-center"
                  >
                    No submissions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
