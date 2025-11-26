"use client"; 
import React, { useState, useEffect } from "react"; 
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button"; 
import { PlusIcon } from "@/icons";

// Data kaga oru puthu type create pannurom
type Transport = {
  tname: string;
  tnickname: string;
  city: string;
  state: string;
  hname: string;
  mobile: string;
  lorrytype: string;
  loadings: string;
  destinations: string;
};

export default function TransportManagementPage() {
  const [transportData, setTransportData] = useState<Transport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 100; 

  useEffect(() => {
    setIsLoading(true);
    // Ippo namma /api/transport ah call panrom
    fetch(`http://localhost:5000/api/transport?page=${currentPage}`) 
      .then(response => response.json())
      .then(data => {
        if (data.data) {
          setTransportData(data.data); 
          setTotalCount(data.totalCount); 
        } else {
          console.error("API Error:", data.message || "Unknown error");
          setTransportData([]);
        }
        setIsLoading(false); 
      })
      .catch(error => {
        console.error("Fetch Error:", error);
        setIsLoading(false);
        setTransportData([]);
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
      <PageBreadcrumb pageTitle="Transport Management" />
      <div className="space-y-6">
        <ComponentCard title="All Transporters">
          <div className="mb-4 flex justify-end">
            <Button
              size="sm"
              variant="primary"
              startIcon={<PlusIcon />}
              onClick={() => {
                console.log("Add New Transport clicked!");
              }}
            >
              Add New Transport
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full min-w-[1200px] table-auto">
              {/* Table Header */}
              <thead className="border-b border-gray-200 dark:border-gray-800">
                <tr className="bg-gray-50 text-left text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-white/90">
                  <th className="px-5 py-4">Transport Name</th>
                  <th className="px-5 py-4">Nickname</th>
                  <th className="px-5 py-4">City</th>
                  <th className="px-5 py-4">State</th>
                  <th className="px-5 py-4">Contact Person</th>
                  <th className="px-5 py-4">Mobile</th>
                  <th className="px-5 py-4">Lorry Type</th>
                  <th className="px-5 py-4">Loadings</th>
                  <th className="px-5 py-4">Destinations</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10">Loading data...</td>
                  </tr>
                ) : (
                  transportData.map((transport, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-gray-200 dark:border-gray-800"
                    >
                      <td className="px-5 py-4">{transport.tname}</td>
                      <td className="px-5 py-4">{transport.tnickname}</td>
                      <td className="px-5 py-4">{transport.city}</td>
                      <td className="px-5 py-4">{transport.state}</td>
                      <td className="px-5 py-4">{transport.hname}</td>
                      <td className="px-5 py-4">{transport.mobile}</td>
                      <td className="px-5 py-4">{transport.lorrytype}</td>
                      <td className="px-5 py-4">{transport.loadings}</td>
                      <td className="px-5 py-4">{transport.destinations}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* --- Pagination --- */}
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