"use client"; 
import React, { useState, useEffect } from "react"; 
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button"; 
import { DownloadIcon } from "@/icons";

// Data kaga oru puthu type create pannurom
type Plant = {
  name: string;
  party: string;
  gstNo: string;
  location: string;
  address: string;
  "Handler Name": string; // Column name la space irukku
  "Handler Mobile": string;
  "Handler E-Mail": string;
};

export default function LocationManagementPage() {
  const [plantData, setPlantData] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 100; 

  useEffect(() => {
    setIsLoading(true);
    // Ippo namma /api/plant ah call panrom
    fetch(`http://localhost:5000/api/plant?page=${currentPage}`) 
      .then(response => response.json())
      .then(data => {
        if (data.data) {
          setPlantData(data.data); 
          setTotalCount(data.totalCount); 
        } else {
          console.error("API Error:", data.message || "Unknown error");
          setPlantData([]);
        }
        setIsLoading(false); 
      })
      .catch(error => {
        console.error("Fetch Error:", error);
        setIsLoading(false);
        setPlantData([]);
      });
  }, [currentPage]); 

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handleDownload = () => {
    if (!plantData || plantData.length === 0) {
      console.log("No data to download");
      return;
    }

    const header = [
      "Plant Name",
      "Party",
      "GST No",
      "Location",
      "Address",
      "Handler Name",
      "Handler Mobile",
      "Handler E-Mail",
    ];

    const rows = plantData.map((p) => [
      p.name,
      p.party,
      p.gstNo,
      p.location,
      p.address,
      p["Handler Name"],
      p["Handler Mobile"],
      p["Handler E-Mail"],
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "locations.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1); 
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Location (Plant List)" />
      <div className="space-y-6">
        <ComponentCard title="All Plants">
          <div className="mb-4 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full min-w-[1200px] table-auto">
              {/* Table Header */}
              <thead className="border-b border-gray-200 dark:border-gray-800">
                <tr className="bg-gray-50 text-left text-sm font-medium text-gray-700 dark:bg-gray-900 dark:text-white/90">
                  <th className="px-5 py-4">Plant Name</th>
                  <th className="px-5 py-4">Party</th>
                  <th className="px-5 py-4">GST No</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Address</th>
                  <th className="px-5 py-4">Handler</th>
                  <th className="px-5 py-4">Mobile</th>
                  <th className="px-5 py-4">Email</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10">Loading data...</td>
                  </tr>
                ) : (
                  plantData.map((plant, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-gray-200 dark:border-gray-800"
                    >
                      <td className="px-5 py-4">{plant.name}</td>
                      <td className="px-5 py-4">{plant.party}</td>
                      <td className="px-5 py-4">{plant.gstNo}</td>
                      <td className="px-5 py-4">{plant.location}</td>
                      <td className="px-5 py-4">{plant.address}</td>
                      <td className="px-5 py-4">{plant["Handler Name"]}</td>
                      <td className="px-5 py-4">{plant["Handler Mobile"]}</td>
                      <td className="px-5 py-4">{plant["Handler E-Mail"]}</td>
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