import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/tables/BasicTableOne"; // Table ah import pannurom
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Mail Monitoring | Distribution Channel",
  description: "Monitor replies from customers.",
};

export default function MailMonitoringPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Mail Monitoring" />
      <div className="space-y-6">
        <ComponentCard title="Customer Replies">
          {/* Ithu oru example table. Namma backend create pannathum,
            ithu unmayana email replies ah kaatum.
          */}
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}