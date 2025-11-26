"use client"; 
import React, { useState, useEffect } from "react"; 
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button"; 
import { PlusIcon } from "@/icons";

// --- ITHA UPDATE PANNIRUKOM (TYPE) ---
type Party = {
  pname: string;
  bname: string;
  businesstype: string;
  partytype: string;
  address: string;
  local: string;
  city: string;
  state: string;
  pincode: string;
  contactno: string;
  hname: string;
  desig: string;
  hNo: string;
  email: string;
  msmestatus: string;
  items: string;
  group: string;
};

export default function PartySectionPage() {
  const [partyData, setPartyData] = useState<Party[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 100; 

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:5000/api/party?page=${currentPage}`) 
      .then(response => response.json())
      .then(data => {
        if (data.data) { 
          setPartyData(data.data); 
          setTotalCount(data.totalCount); 
        } else {
          console.error("API Error:", data.message || "Unknown error");
          setPartyData([]); 
          setTotalCount(0);
        }
        setIsLoading(false); 
      })
      .catch(error => {
        console.error("Fetch Error:", error);
        setIsLoading(false);
        setPartyData([]); 
      });
  }, [currentPage]); 

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1); 
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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
                console.log("Add New Party clicked!");
              }}
            >
              Add New Party
            </Button>
          </div>

          {/* --- ITHA UPDATE PANNIRUKOM (TABLE) --- */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            {/* min-w-[1800px] nu maathirukom, ella columns theriyurathuku */}
            <table className="w-full min-w-[1800px] table-auto">
              {/* Table Header */}
              <thead className="border-b border-gray-200 dark:border-gray-800">
                <tr className="bg-gray-50 text-left text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-white/90">
                  <th className="px-5 py-4">Party Name</th>
                  <th className="px-5 py-4">Business Name</th>
                  <th className="px-5 py-4">Business Type</th>
                  <th className="px-5 py-4">Party Type</th>
                  <th className="px-5 py-4">Address</th>
                  <th className="px-5 py-4">City</th>
                  <th className="px-5 py-4">State</th>
                  <th className="px-5 py-4">Pincode</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Handler</th>
                  <th className="px-5 py-4">MSME</th>
                  <th className="px-5 py-4">Items</th>
                  <th className="px-5 py-4">Group</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={17} className="text-center py-10">Loading data...</td>
                  </tr>
                ) : (
                  partyData.map((party, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-gray-200 dark:border-gray-800"
                    >
                      <td className="px-5 py-4">{party.pname}</td>
                      <td className="px-5 py-4">{party.bname}</td>
                      <td className="px-5 py-4">{party.businesstype}</td>
                      <td className="px-5 py-4">{party.partytype}</td>
                      <td className="px-5 py-4">{party.address}</td>
                      <td className="px-5 py-4">{party.city}</td>
                      <td className="px-5 py-4">{party.state}</td>
                      <td className="px-5 py-4">{party.pincode}</td>
                      <td className="px-5 py-4">{party.contactno}</td>
                      <td className="px-5 py-4">{party.hname}</td>
                      <td className="px-5 py-4">{party.msmestatus}</td>
                      <td className="px-5 py-4">{party.items}</td>
                      <td className="px-5 py-4">{party.group}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* --- Pagination (No change) --- */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button size="sm" variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>
          
        </ComponentCard>
      </div>
    </div>
  );
}