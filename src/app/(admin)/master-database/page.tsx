"use client"; // "use client" add pannurom, button/modal kaga
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/tables/BasicTableOne"; // Table ah import pannurom
import Button from "@/components/ui/button/Button"; // Button ah import pannurom
import { PlusIcon, DownloadIcon } from "@/icons"; // Icons ah import pannurom
// import { Metadata } from "next"; // "use client" la metadata use panna koodathu

// export const metadata: Metadata = { // Commenting this out
//   title: "Master Database | Distribution Channel",
//   description: "Manage all master data in one place.",
// };

export default function MasterDatabasePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Master Database Management" />
      <div className="space-y-6">
        <ComponentCard title="Master Data">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Inga "Upload Excel" logic varum
                console.log("Upload Excel clicked!");
              }}
            >
              Upload from Excel
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              startIcon={<DownloadIcon />}
              onClick={() => {
                // Inga "Download Data" logic varum
                console.log("Download Data clicked!");
              }}
            >
              Download Data
            </Button>

            <Button
              size="sm"
              variant="primary"
              startIcon={<PlusIcon />}
              onClick={() => {
                // Inga "Add New Data" modal open panra logic varum
                console.log("Add New Data clicked!");
              }}
            >
              Add New Data
            </Button>
          </div>

          {/* Ithu oru example table. Namma backend create pannathum,
            ithu unmayana master data va kaatum.
          */}
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}