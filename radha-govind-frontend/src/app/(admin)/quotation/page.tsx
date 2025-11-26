"use client"; // "use client" add pannurom, state use panna
import React, { useState } from "react"; // useState import pannurom
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea"; // TextArea component ah import pannurom
import { PaperPlaneIcon } from "@/icons"; // PaperPlaneIcon ah import pannurom

export default function QuotationPage() {
  // Form fields kaga state
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendQuote = () => {
    // Inga than email anuppura logic varum
    console.log("Sending Quotation:", { toEmail, subject, message });
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Quotation & Email" />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Side: Form */}
        <div className="col-span-12 xl:col-span-8">
          <ComponentCard title="Create New Quotation">
            <form
              className="space-y-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <Label>To (Customer Email)</Label>
                <Input
                  type="email"
                  placeholder="Enter customer email(s), separated by commas"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Subject</Label>
                <Input
                  type="text"
                  placeholder="E.g., Quotation for your recent inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <Label>Message</Label>
                <TextArea
                  rows={8}
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(value) => setMessage(value)}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  startIcon={<PaperPlaneIcon />} // Icon add pannirukom
                  onClick={handleSendQuote}
                >
                  Send Quotation
                </Button>
              </div>
            </form>
          </ComponentCard>
        </div>

        {/* Right Side: Details */}
        <div className="col-span-12 xl:col-span-4">
          <ComponentCard title="Route & Cost Details">
            <div className="space-y-4">
              {/* Intha details ellam namma "Route Planning" page la irunthu eduthu inga kaatuvom */}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Route
                </p>
                <p className="font-medium text-gray-800 dark:text-white/90">
                  Not Selected
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Distance
                </p>
                <p className="font-medium text-gray-800 dark:text-white/90">
                  -- km
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Estimated Cost (Freight)
                </p>
                <p className="font-medium text-gray-800 dark:text-white/90">
                  ₹--
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}