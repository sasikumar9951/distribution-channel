"use client"; // "use client" add pannurom, button/modal kaga
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/tables/BasicTableOne"; // Table ah import pannurom
import Button from "@/components/ui/button/Button"; // Button ah import pannurom
import { PlusIcon } from "@/icons";
// import { Metadata } from "next"; // "use client" la metadata use panna koodathu

// export const metadata: Metadata = { // Commenting this out
//   title: "Party Section | Distribution Channel",
//   description: "Manage customer and client details.",
// };

export default function PartySectionPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Party Section" />
      <div className="space-y-6">
        <ComponentCard title="All Parties (Customers & Clients)">
          <div className="mb-4 flex justify-end">
            <Button
              size="sm"
              variant="primary"
              startIcon={<PlusIcon />}
              onClick={() => {
                // Inga "Add New Party" modal open panra logic varum
                console.log("Add New Party clicked!");
              }}
            >
              Add New Party
            </Button>
          </div>

          {/* Ithu oru example table. Namma backend create pannathum,
            ithu unmayana customer/client data va kaatum.
          */}
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}