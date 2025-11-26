"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useRouter } from "next/navigation"; // Redirect பண்ண

export default function AddLocationPage() {
  const router = useRouter();
  
  // Form States
  const [newLocationName, setNewLocationName] = useState("");
  const [newPartyName, setNewPartyName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCoords, setNewCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveLocation = async () => {
    setIsSaving(true);
    
    const newPlantData = {
      name: newLocationName,
      party: newPartyName,
      location: newLocation,
      address: newAddress,
      coords: newCoords
    };

    try {
      const response = await fetch('http://localhost:5000/api/plant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlantData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Location added successfully!");
        // Save ஆனதும் View Page-க்கு திருப்பி அனுப்புகிறோம்
        router.push('/location-management'); 
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add New Location" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <ComponentCard title="Location Details">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="p-6.5">
                
                {/* Map Placeholder */}
                <div className="w-full h-64 mb-5 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                   <p className="text-gray-500">Google Map Here (Requires API Key)</p>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <Label>Location Name*</Label>
                    <Input 
                      type="text" 
                      placeholder="E.g., Chennai Port" 
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <Label>Party Name*</Label>
                    <Input 
                      type="text" 
                      placeholder="E.g., ANTARANG INDUSTRIES" 
                      value={newPartyName}
                      onChange={(e) => setNewPartyName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <Label>Address*</Label>
                  <Input 
                    type="text" 
                    placeholder="Map la select pannunga..." 
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                </div>

                <div className="mb-4.5">
                  <Label>Location / City*</Label>
                  <Input 
                    type="text" 
                    placeholder="E.g., Jabalpur, Madhya Pradesh" 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 justify-end">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => router.back()} // Cancel பண்ணா பின்னாடி போகும்
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSaveLocation} 
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Location"}
                  </Button>
                </div>
              </div>
            </form>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}