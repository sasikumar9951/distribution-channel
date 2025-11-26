"use client";
import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Button from "../../../components/ui/button/Button";

// --- Styles & Config ---
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
};

const defaultCenter = {
  lat: 21.1458,
  lng: 79.0882,
};

const inputStyle =
  "w-full rounded-lg border border-gray-300 bg-transparent py-3 px-5 text-black outline-none transition focus:border-blue-500 active:border-blue-500 disabled:cursor-default disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500";

const libraries: ("places")[] = ["places"];

// Define Type for DB Plant Data
interface Plant {
  name: string;
  party: string;
  location: string;
  address: string;
  lat: number;
  lng: number;
  distanceKm: string;
}

export default function RoutePlanningPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries: libraries,
  });

  // --- States ---
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  
  // Route Data
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [cost, setCost] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // DB Data States
  const [manufacturers, setManufacturers] = useState<Plant[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Plant | null>(null);
  const [isLoadingPlants, setIsLoadingPlants] = useState(false);

  // Refs
  const originRef = useRef<HTMLInputElement>(null);
  const destRef = useRef<HTMLInputElement>(null);
  const waypointsRef = useRef<HTMLInputElement>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // --- 1. Calculate Route ---
  async function calculateRoute() {
    if (!originRef.current?.value || !destRef.current?.value) {
      alert("Please enter both Start Point and Destination.");
      return;
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();

    try {
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destRef.current.value,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      
      if (results.routes && results.routes.length > 0 && results.routes[0].legs && results.routes[0].legs.length > 0) {
        const leg = results.routes[0].legs[0];
        setDistance(leg.distance?.text || "");
        setDuration(leg.duration?.text || "");
        
        const km = (leg.distance?.value || 0) / 1000;
        setCost((km * 50).toFixed(2)); // Placeholder cost logic

        // Trigger DB Search near Destination
        const endLat = leg.end_location.lat();
        const endLng = leg.end_location.lng();
        
        fetchNearbyPlantsFromDB(endLat, endLng);
      }
    } catch (error) {
      console.error("Error calculating route:", error);
      alert("Could not calculate route. Check inputs.");
    }
  }

  // --- 2. Fetch from YOUR Database (Replacing Google Places API) ---
  async function fetchNearbyPlantsFromDB(lat: number, lng: number) {
    setIsLoadingPlants(true);
    setManufacturers([]); // Clear old results

    try {
      // Calling our new Backend API
      const radius = 50; // Search within 50km
      const response = await fetch(`http://localhost:5000/api/plant/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
      
      if (response.ok) {
        const result = await response.json();
        setManufacturers(result.data); 
        console.log("DB Manufacturers:", result.data);
      } else {
        console.error("Failed to fetch plants from DB");
      }
    } catch (error) {
      console.error("Error fetching plants:", error);
    } finally {
      setIsLoadingPlants(false);
    }
  }

  // --- 3. Save Route Logic ---
  async function saveRoute() {
    if (!distance || !cost) {
      alert("Please plan a route first.");
      return;
    }
    setIsSaving(true);
    const payload = {
      origin: originRef.current?.value,
      destination: destRef.current?.value,
      waypoints: waypointsRef.current?.value || "",
      distance: distance,
      duration: duration,
      cost: cost,
    };
    try {
      const response = await fetch("http://localhost:5000/api/saved-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) alert("Route Saved Successfully! 💾");
      else alert("Failed to save route");
    } catch (error) {
      console.error("Save Error:", error);
      alert("Error connecting to server.");
    } finally {
      setIsSaving(false);
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setCost(null);
    setManufacturers([]);
    setSelectedManufacturer(null);
    if (originRef.current) originRef.current.value = "";
    if (destRef.current) destRef.current.value = "";
    if (waypointsRef.current) waypointsRef.current.value = "";
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Route Planning (Internal DB)" />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Side: Form */}
        <div className="col-span-12 xl:col-span-4">
          <ComponentCard title="Plan Route">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <Label>Start Point</Label>
                {isLoaded ? (
                  <Autocomplete>
                    <input className={inputStyle} type="text" placeholder="Start location..." ref={originRef} />
                  </Autocomplete>
                ) : <input className={inputStyle} disabled placeholder="Loading Maps..." />}
              </div>

              <div>
                <Label>Destination</Label>
                {isLoaded ? (
                  <Autocomplete>
                    <input className={inputStyle} type="text" placeholder="Destination..." ref={destRef} />
                  </Autocomplete>
                ) : <input className={inputStyle} disabled placeholder="Loading Maps..." />}
              </div>

               <div>
                <Label>Waypoints (Optional)</Label>
                <input
                  className={inputStyle}
                  type="text"
                  placeholder="Stops (e.g. Delhi, Agra)"
                  ref={waypointsRef}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button size="sm" className="w-full" onClick={calculateRoute}>Plan Route</Button>
                <Button size="sm" variant="outline" className="w-1/3" onClick={clearRoute}>Clear</Button>
              </div>
            </form>

            {/* Stats */}
            {(distance && duration) && (
               <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                 <h4 className="mb-3 font-semibold text-gray-800 dark:text-white">Trip Details:</h4>
                 <div className="flex justify-between mb-1 text-sm"><span className="text-gray-600 dark:text-gray-400">Distance:</span><span className="font-bold text-blue-600">{distance}</span></div>
                 <div className="flex justify-between mb-1 text-sm"><span className="text-gray-600 dark:text-gray-400">Time:</span><span className="font-bold text-blue-600">{duration}</span></div>
                 <div className="flex justify-between pt-2 border-t border-blue-200 mt-2 text-sm"><span className="text-gray-600 dark:text-gray-400">Est. Cost (₹50/km):</span><span className="font-bold text-green-600">₹{cost}</span></div>
                 
                 <div className="mt-4">
                    <Button 
                      size="sm" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={saveRoute}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "💾 Save This Route"}
                    </Button>
                 </div>
               </div>
            )}

            {/* Manufacturers List from DB */}
            {manufacturers.length > 0 ? (
              <div className="mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm">Nearby Manufacturers (From DB) ({manufacturers.length})</h4>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {manufacturers.map((m, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition" 
                      onClick={() => setSelectedManufacturer(m)}
                    >
                      <p className="font-medium text-sm text-gray-800 dark:text-white">{m.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{m.location} ({m.distanceKm} km away)</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : isLoadingPlants ? (
              <div className="mt-6 text-sm text-gray-500">Searching your database...</div>
            ) : null}
          </ComponentCard>
        </div>

        {/* Right Side: Map */}
        <div className="col-span-12 xl:col-span-8">
          <ComponentCard title="Interactive Map">
            <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={defaultCenter}
                  zoom={5}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  options={{
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                >
                  {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
                  
                  {/* Markers for DB Manufacturers */}
                  {manufacturers.map((place, idx) => (
                    <Marker
                      key={idx}
                      position={{ lat: place.lat, lng: place.lng }}
                      title={place.name}
                      onClick={() => setSelectedManufacturer(place)}
                      // Blue marker to signify DB data
                      icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
                    />
                  ))}

                  {selectedManufacturer && (
                    <InfoWindow
                      position={{ lat: selectedManufacturer.lat, lng: selectedManufacturer.lng }}
                      onCloseClick={() => setSelectedManufacturer(null)}
                    >
                      <div className="text-black p-1 max-w-xs">
                        <h3 className="font-bold text-sm">{selectedManufacturer.name}</h3>
                        <p className="text-xs mt-1">{selectedManufacturer.address}</p>
                        <p className="text-xs font-semibold mt-1">Party: {selectedManufacturer.party}</p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                   <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
                   <p className="mt-2 text-gray-500">Loading Google Maps...</p>
                </div>
              )}
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}