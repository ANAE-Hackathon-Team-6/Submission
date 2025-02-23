import SubmissionsTable from "../../components/users/SubmissionsTable";
import DropzoneComponent from "../../components/form/form-elements/DropZone";
import React from "react";
export default function SubmissionTable() {
    return (
        <div className="flex-col flex gap-4" >
            
            <DropzoneComponent />
            <SubmissionsTable />
        </div>
    );
}
