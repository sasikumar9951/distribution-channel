"use client"; 
import React, { useState, useEffect } from "react"; 
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button"; 
import { PlusIcon, DownloadIcon } from "@/icons";

// Data kaga puthu types
type MasterItem = { name: string };

type MasterData = {
  partyTypes: MasterItem[];
  businessTypes: MasterItem[];
  msmeStatus: MasterItem[];
  items: MasterItem[];
  groups: MasterItem[];
  lorryTypes: MasterItem[];
  loadings: MasterItem[];
  destinations: MasterItem[];
};

// Oru chinna table component create pannikalam
const MasterDataTable: React.FC<{ title: string; data: MasterItem[] }> = ({ title, data }) => (
  <div className="rounded-lg border border-gray-200 dark:border-gray-800">
    <h3 className="border-b border-gray-200 bg-gray-50 px-5 py-3 text-sm font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90">
      {title}
    </h3>
    <div className="h-60 overflow-y-auto">
      <table className="w-full table-auto">
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 dark:border-gray-800">
                <td className="px-5 py-3 text-sm">{item.name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-5 py-3 text-sm text-gray-500">No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);


export default function MasterDatabasePage() {
  const [masterData, setMasterData] = useState<MasterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Namma puthu API ah call panrom
    fetch(`http://localhost:5000/api/master-data`) 
      .then(response => response.json())
      .then(data => {
        if (data.partyTypes) { // Ethachum oru data vanthirukka nu check panrom
          setMasterData(data); 
        } else {
          console.error("API Error:", data.message || "Unknown error");
          setMasterData(null);
        }
        setIsLoading(false); 
      })
      .catch(error => {
        console.error("Fetch Error:", error);
        setIsLoading(false);
        setMasterData(null);
      });
  }, []); // Page load aana udane oru thadava mattum run aagum

  return (
    <div>
      <PageBreadcrumb pageTitle="Master Database Management" />
      <div className="space-y-6">
        <ComponentCard title="Master Data">
          {/* Top buttons apdiye irukattum */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button size="sm" variant="outline" onClick={() => { console.log("Upload Excel clicked!"); }}>
              Upload from Excel
            </Button>
            <Button size="sm" variant="outline" startIcon={<DownloadIcon />} onClick={() => { console.log("Download Data clicked!"); }}>
              Download Data
            </Button>
            <Button size="sm" variant="primary" startIcon={<PlusIcon />} onClick={() => { console.log("Add New Data clicked!"); }}>
              Add New Data
            </Button>
          </div>

          {/* Ippo inga namma 8 tables ah kaatrom */}
          {isLoading ? (
            <div className="text-center py-10">Loading master data...</div>
          ) : !masterData ? (
            <div className="text-center py-10 text-red-500">Failed to load data.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MasterDataTable title="Party Types" data={masterData.partyTypes} />
              <MasterDataTable title="Business Types" data={masterData.businessTypes} />
              <MasterDataTable title="MSME Status" data={masterData.msmeStatus} />
              <MasterDataTable title="Items" data={masterData.items} />
              <MasterDataTable title="Groups" data={masterData.groups} />
              <MasterDataTable title="Lorry Types" data={masterData.lorryTypes} />
              <MasterDataTable title="Loadings" data={masterData.loadings} />
              <MasterDataTable title="Destinations" data={masterData.destinations} />
            </div>
          )}
          
        </ComponentCard>
      </div>
    </div>
  );
}