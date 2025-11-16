"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/tables/BasicTableOne";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

// Intha component ah namma aduthu create pannuvom
// import LocationPickerMap from "@/components/LocationPickerMap"; 

export default function LocationManagementPage() {
  const { isOpen, openModal, closeModal } = useModal();

  // Form fields kaga state create pannurom
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const handleSaveLocation = () => {
    // Inga than namma location ah database la save panra logic eluthuvom
    console.log("Saving Location:", { locationName, address, city, state });
    closeModal(); 
  };
  
  // Map la select panna, intha function call aagum
  const handleMapSelect = (selectedAddress: any) => {
    // (Google Geocoding API la irunthu vara data va inga set pannuvom)
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Location Management" />

      <div className="space-y-6">
        <ComponentCard title="All Locations">
          <div className="mb-4 flex justify-end">
            <Button
              size="sm"
              variant="primary"
              startIcon={<PlusIcon />}
              onClick={openModal} 
            >
              Add New Location
            </Button>
          </div>
          <BasicTableOne />
        </ComponentCard>
      </div>

      {/* --- Add New Location Modal (With Map) --- */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-5 lg:p-10" // Modal size ah perusu pannirukom
      >
        <form>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Add New Location
          </h4>

          {/* Map kaga oru placeholder */}
          <div className="w-full h-64 mb-5 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Google Map</p>
            {/* API key kedaichathum, inga map component ah add pannalam:
            <LocationPickerMap onLocationSelect={handleMapSelect} /> 
            */}
          </div>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1 sm:col-span-2">
              <Label>Location Name</Label>
              <Input 
                type="text" 
                placeholder="E.g., Chennai Port" 
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label>Address</Label>
              <Input 
                type="text" 
                placeholder="Select In Map" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="col-span-1">
              <Label>City</Label>
              <Input 
                type="text" 
                placeholder="Select In Map" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="col-span-1">
              <Label>State</Label>
              <Input 
                type="text" 
                placeholder="Select In Map" 
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSaveLocation}>
              Save Location
            </Button>
          </div>
        </form>
      </Modal>
      {/* --- Modal Ends --- */}
    </div>
  );
}