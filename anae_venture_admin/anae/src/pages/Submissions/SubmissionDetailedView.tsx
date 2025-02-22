import React from "react";
import { useNavigate } from "react-router-dom";
import { useSubmissionDetailViewModel } from "../../viewmodels/useSubmissionDetailViewModel";

export default function SubmissionDetailedView() {
  const { submission, loading, error, setSubmission } =
    useSubmissionDetailViewModel();
  const navigate = useNavigate();

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">{error}</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 mt-4 text-white bg-red-600 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!submission) return null;

  const handleAccept = () => {
    const updatedSubmission = {
      ...submission,
      processed: "Processed",
      is_valid_human: true, // Assuming acceptance means valid
    };

    setSubmission(updatedSubmission); // Update the state

    setSuccessMessage(
      `Submission ${submission.submissionId} has been accepted.`
    );
  };
  return (
    <div className="max-w-4xl p-4 mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 mb-4 text-white rounded bg-success-500"
      >
        Back to Submissions
      </button>

      <h1 className="mb-6 text-2xl font-bold text-gray-700">
        Submission Detail
      </h1>

      {/* Pending Banner */}
      {submission.processed === "Pending" && (
        <div className="p-4 mb-6 bg-red-100 border border-red-400 rounded">
          <p className="font-bold text-red-700">
            This submission is <span className="underline">Pending</span>{" "}
            review.
          </p>
        </div>
      )}

      {/* Submission Details Card */}
      {/* Submission Details Card */}
      <div className="p-6 mb-6 space-y-4 bg-white rounded shadow dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Detail label="Submission ID" value={submission.submissionId} />
          <Detail
            label="Date"
            value={new Date(submission.date).toLocaleString()}
          />
          <Detail label="Wilaya" value={submission.wilaya} />
          <Detail label="Category" value={submission.category} />
        </div>
      </div>

      {/* AI Suggestions Card */}
      <div className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md border border-blue-300 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold text-blue-700 flex items-center">
          <span className="mr-2">🤖</span> AI Suggestions
        </h2>

        {/* AI Refined Activity Name */}
        <div className="p-4 bg-white border-l-4 border-blue-400 rounded-md shadow-sm dark:bg-gray-900">
          <p className="text-gray-500">Original Activity Name:</p>
          <p className="text-lg font-semibold text-gray-800">
            {submission.activityName}
          </p>
          <p className="mt-2 text-gray-500">AI-Refined Activity Name:</p>
          <p
            className={`text-lg font-semibold italic ${
              submission.refined_activity ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {submission.refined_activity || "No AI refinement available"}
          </p>
        </div>

        {/* AI Refined Description */}
        <div className="p-4 mt-4 bg-white border-l-4 border-blue-400 rounded-md shadow-sm dark:bg-gray-900">
          <p className="text-gray-500">Original Description:</p>
          <p className="text-sm text-gray-800">{submission.description}</p>
          <p className="mt-2 text-gray-500">AI-Refined Description:</p>
          <p
            className={`text-sm italic ${
              submission.refined_description ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {submission.refined_description || "No AI refinement available"}
          </p>
        </div>

        {/* AI Suggested Sub-Category */}
        <div className="p-4 mt-4 bg-white border-l-4 border-blue-400 rounded-md shadow-sm dark:bg-gray-900">
          <p className="text-gray-500">AI-Suggested Sub-Category:</p>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              submission.sub_category
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            {submission.sub_category || "No AI suggestion"}
          </span>
        </div>
      </div>
      {/* AI Decision & Redundancy */}
      {submission.processed === "Pending" ? (
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
          <DecisionCard
            title="AI Decision"
            details={[
              { label: "Valid", value: submission.is_valid_ai ? "Yes" : "No" },
              { label: "Reason", value: submission.why_valid_ai || "N/A" },
            ]}
          />
          <DecisionCard
            title="Redundancy Check"
            details={[
              {
                label: "Redundant",
                value: submission.is_redundant_ai ? "Yes" : "No",
              },
              { label: "Reason", value: submission.why_redundant_ai || "N/A" },
            ]}
          />
        </div>
      ) : (
        <DecisionCard
          title="Admin Decision"
          details={[
            {
              label: "Valid",
              value: submission.is_valid_human ? "Valid" : "Invalid",
            },
          ]}
          bgColor="bg-green-50"
          textColor="text-green-700"
        />
      )}

      {/* Redundancy Information */}
      <RedundancyCard
        title="Redundant Activities"
        activities={submission.redundant_activities}
        navigate={navigate}
      />
      <RedundancyCard
        title="Redundant Activities Among History"
        activities={submission.redundant_activities_among_history}
        navigate={navigate}
      />

      {/* Most Similar Submissions */}
      <div className="p-4 mb-6 border rounded shadow bg-gray-50 dark:bg-gray-800">
        <p className="font-bold text-gray-600">
          Most Similar Submissions ({submission.most_similar_submissions_count})
        </p>
        {submission.most_similar_submissions.length > 0 ? (
          <ul className="mt-2 ml-6 list-disc">
            {submission.most_similar_submissions.map((simSub) => (
              <li key={simSub}>{simSub}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-500">No similar submissions found.</p>
        )}
      </div>

      {/* Validate Suggestion */}
      {submission.processed === "Pending" && (
        <div className="p-4 mb-6 bg-white border rounded shadow dark:bg-gray-800">
          <p className="mb-2 font-bold text-gray-700">
            Do you want to validate this suggestion?
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-2 text-white bg-green-600 rounded"
            >
              Accept
            </button>
            <button
              onClick={() =>
                alert(`Declined submission ${submission.submissionId}`)
              }
              className="flex-1 px-4 py-2 text-white bg-red-600 rounded"
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Component for Key-Value Display
const Detail = ({ label, value }) => (
  <div>
    <p className="font-semibold text-gray-600">{label}</p>
    <p className="text-gray-500">{value}</p>
  </div>
);

// Decision Card Component
const DecisionCard = ({
  title,
  details,
  bgColor = "bg-red-50",
  textColor = "text-red-700",
}) => (
  <div className={`p-4 border rounded shadow ${bgColor}`}>
    <p className={`font-bold ${textColor}`}>{title}</p>
    {details.map((detail, index) => (
      <p key={index} className="mt-2">
        <span className="font-semibold">{detail.label}: </span>
        {detail.value}
      </p>
    ))}
  </div>
);

// Redundancy Information Card
const RedundancyCard = ({ title, activities, navigate }) => {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="p-4 mb-6 border rounded shadow bg-gray-50 dark:bg-gray-800">
      <p className="font-bold text-gray-600">{title}</p>
      <ul className="mt-2 ml-6 list-disc">
        {activities.map((activity) => (
          <li key={activity}>
            <button
              className="text-blue-500 underline"
              onClick={() => navigate(`/submissions/${activity}`)}
            >
              {activity}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
