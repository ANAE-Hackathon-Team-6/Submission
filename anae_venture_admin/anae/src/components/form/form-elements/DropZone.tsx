import { useState } from "react";
import { useDropzone } from "react-dropzone";
import ComponentCard from "../../common/ComponentCard";

const UPLOAD_URL = "http://localhost:8000/api/files/upload/";

const DropzoneComponent: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    setErrorMessage(null);
    if (acceptedFiles.length === 0) return;

    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("csv_file", file);
    });

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const result = await response.json();
      console.log("Upload Success:", result);
    } catch (error) {
      console.error("Upload Error:", error);
      setErrorMessage("File upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
    },
  });

  return (
    <ComponentCard title="Submissions List">
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-success-500 dark:border-gray-700 rounded-xl hover:border-success-500">
        <form
          {...getRootProps()}
          className={`dropzone rounded-xl border-dashed border-gray-300 p-2 lg:p-4
          ${
            isDragActive
              ? "border-success-500 bg-gray-100 dark:bg-gray-800"
              : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          }
        `}
          id="demo-upload"
        >
          {/* Hidden Input */}
          <input {...getInputProps()} />

          <div className="dz-message flex flex-col items-center !m-0">
            <div className="mb-[15px] flex justify-center">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
            </h4>

            <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              Drag and drop your CSV, EXCEL files here or browse
            </span>

            <span className="font-medium underline text-theme-sm text-success-500">
              Browse File
            </span>

            {uploading && (
              <div className="mt-3 w-full bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                  className="bg-success-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress}%
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mt-3 text-red-500 text-sm">{errorMessage}</div>
            )}
          </div>
        </form>
      </div>
    </ComponentCard>
  );
};

export default DropzoneComponent;
