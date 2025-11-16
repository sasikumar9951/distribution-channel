"use client"; // "use client" add pannurom, state use panna
import React, { useState } from "react"; // useState import pannurom
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

export default function RoutePlanningPage() {
  // Form fields kaga state
  const [startPoint, setStartPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState(""); // Waypoints ah ippo simple ah oru text ah vechikalam

  const handlePlanRoute = () => {
    // Inga than Google Maps API vechi route plan panra logic varum
    console.log("Planning Route:", { startPoint, destination, waypoints });
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Route Planning" />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Side: Form */}
        <div className="col-span-12 xl:col-span-4">
          <ComponentCard title="Plan a New Route">
            <form
              className="space-y-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <Label>Start Point</Label>
                <Input
                  type="text"
                  placeholder="Enter start location or select from map"
                  value={startPoint}
                  onChange={(e) => setStartPoint(e.target.value)}
                />
              </div>

              <div>
                <Label>Destination</Label>
                <Input
                  type="text"
                  placeholder="Enter destination or select from map"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div>
                <Label>Waypoints (Optional)</Label>
                <Input
                  type="text"
                  placeholder="Enter stops (e.g., Location A, Location B)"
                  value={waypoints}
                  onChange={(e) => setWaypoints(e.target.value)}
                />
              </div>

              <Button size="sm" className="w-full" onClick={handlePlanRoute}>
                Plan Route
              </Button>
            </form>
          </ComponentCard>
        </div>

        {/* Right Side: Map */}
        <div className="col-span-12 xl:col-span-8">
          <ComponentCard title="Route Map">
            <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                Google Map 
              </p>
              {/* API key kedaichathum, inga map component ah add pannalam */}
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}