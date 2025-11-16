"use client"; // "use client" add pannurom, button/modal kaga
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/tables/BasicTableOne"; // Table ah import pannurom
import Button from "@/components/ui/button/Button"; // Button ah import pannurom
import { PlusIcon } from "@/icons";
// import { Metadata } from "next"; // "use client" la metadata use panna koodathu

// export const metadata: Metadata = { // Commenting this out
//   title: "Freight Management | Distribution Channel",
//   description: "Manage freight-related data.",
// };

export default function FreightManagementPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Transport & Freight Management" />
      <div className="space-y-6">
        <ComponentCard title="Freight Data">
          <div className="mb-4 flex justify-end">
            <Button
              size="sm"
              variant="primary"
              startIcon={<PlusIcon />}
              onClick={() => {
                // Inga "Add New Freight" modal open panra logic varum
                console.log("Add New Freight Data clicked!");
              }}
            >
              Add New Freight
            </Button>
          </div>

          {/* Ithu oru example table. Namma backend create pannathum,
            ithu unmayana freight data va kaatum.
          */}
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}