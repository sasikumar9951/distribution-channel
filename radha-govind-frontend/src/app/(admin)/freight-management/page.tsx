"use client"; 
import React, { useState, useEffect } from "react"; 
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button"; 
import { PlusIcon } from "@/icons";

// Data kaga oru puthu type create pannurom
type Freight = {
  fromParty: string;
  toParty: string;
  items: string;
  fDate: string;
  itemsQty: number;
  transportName: string;
  pmt: number;
};

export default function FreightManagementPage() {
  const [freightData, setFreightData] = useState<Freight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- PAGINATION KAGA PUTHU STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 100; // Namma backend la set panna athe number

  // Intha hook ippo 'currentPage' maarumbothu thirumba run aagum
  useEffect(() => {
    setIsLoading(true);
    // API la irunthu data va fetch pannurom (puthu page number kooda)
    fetch(`http://localhost:5000/api/freight?page=${currentPage}`) 
      .then(response => response.json())
      .then(data => {
        setFreightData(data.data); // Namma data
        setTotalCount(data.totalCount); // Namma total count
        setIsLoading(false); 
      })
      .catch(error => {
        console.error("Error fetching freight data:", error);
        setIsLoading(false);
      });
  }, [currentPage]); // <-- Ithu romba mukkiyam

  // Date format panra oru chinna function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  // Pagination kaga calculations
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); // Adutha page ku po
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); // Munthina page ku po
    }
  };

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
                console.log("Add New Freight Data clicked!");
              }}
            >
              Add New Freight
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full min-w-[700px] table-auto">
              {/* Table Header */}
              <thead className="border-b border-gray-200 dark:border-gray-800">
                <tr className="bg-gray-50 text-left text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-white/90">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">From Party</th>
                  <th className="px-5 py-4">To Party</th>
                  <th className="px-5 py-4">Items</th>
                  <th className="px-5 py-4">Transport</th>
                  <th className="px-5 py-4">Qty</th>
                  <th className="px-5 py-4 text-right">Pmt</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10">Loading data...</td>
                  </tr>
                ) : (
                  freightData.map((freight, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-gray-200 dark:border-gray-800"
                    >
                      <td className="px-5 py-4">{formatDate(freight.fDate)}</td>
                      <td className="px-5 py-4">{freight.fromParty}</td>
                      <td className="px-5 py-4">{freight.toParty}</td>
                      <td className="px-5 py-4">{freight.items}</td>
                      <td className="px-5 py-4">{freight.transportName}</td>
                      <td className="px-5 py-4">{freight.itemsQty}</td>
                      <td className="px-5 py-4 text-right">{freight.pmt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* --- ITHU THAN PUTHU PAGINATION --- */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage === 1} // Mudhal page la iruntha, disable pannu
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages} // Kadaisi page la iruntha, disable pannu
              >
                Next
              </Button>
            </div>
          </div>
          
        </ComponentCard>
      </div>
    </div>
  );
}