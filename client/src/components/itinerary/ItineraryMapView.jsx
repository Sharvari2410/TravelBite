import React, { useEffect, useMemo, useRef, useState } from "react";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function FitRoute({ spots, userPosition, fitSignal }) {
  const map = useMap();

  useEffect(() => {
    const points = [
      ...spots.map((spot) => [spot.lat, spot.lng]),
      ...(userPosition ? [[userPosition.lat, userPosition.lng]] : [])
    ];

    if (points.length === 0) return;

    const bounds = L.latLngBounds(points);
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, spots, userPosition, fitSignal]);

  return null;
}

function SpotFocus({ selectedSpot, markerRef }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedSpot) return;

    map.flyTo([selectedSpot.lat, selectedSpot.lng], 14, { duration: 0.8 });
    const marker = markerRef.current[selectedSpot.id];
    if (marker) marker.openPopup();
  }, [map, markerRef, selectedSpot]);

  return null;
}

export default function ItineraryMapView({ spots = [], city, selectedSpotId, onSpotSelect }) {
  const [userPosition, setUserPosition] = useState(null);
  const [locating, setLocating] = useState(false);
  const [fitSignal, setFitSignal] = useState(0);
  const markerRef = useRef({});

  const selectedSpot = useMemo(
    () => spots.find((spot) => spot.id === selectedSpotId) || spots[0] || null,
    [spots, selectedSpotId]
  );

  const center = useMemo(() => {
    if (selectedSpot) return [selectedSpot.lat, selectedSpot.lng];
    return [22.9734, 78.6569];
  }, [selectedSpot]);

  const routePath = spots.map((spot) => [spot.lat, spot.lng]);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        setFitSignal((value) => value + 1);
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="rounded-3xl border border-[#3a1b2f] bg-[#1a0c16] p-5 text-sm text-[#cab8c7]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-lg font-semibold text-white">Live Map View: {city}</p>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSpot?.id || ""}
            onChange={(event) => onSpotSelect?.(event.target.value)}
            className="rounded-full border border-[#3a1b2f] bg-[#12050d] px-3 py-1 text-xs text-[#f2d8e8]"
          >
            {spots.map((spot) => (
              <option key={spot.id} value={spot.id}>
                {spot.time} - {spot.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setFitSignal((value) => value + 1)}
            className="rounded-full border border-[#3a1b2f] px-3 py-1 text-xs"
          >
            Fit Route
          </button>
          <button
            onClick={locateMe}
            className="rounded-full bg-[#7a1338] px-3 py-1 text-xs font-semibold text-white"
          >
            {locating ? "Locating..." : "Locate Me"}
          </button>
          {selectedSpot ? (
            <a
              href={`https://www.openstreetmap.org/?mlat=${selectedSpot.lat}&mlon=${selectedSpot.lng}#map=15/${selectedSpot.lat}/${selectedSpot.lng}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#3a1b2f] px-3 py-1 text-xs text-[#f7d0a1]"
            >
              Open Spot
            </a>
          ) : null}
        </div>
      </div>

      <div className="h-56 w-full overflow-hidden rounded-xl border border-[#3a1b2f]">
        <MapContainer center={center} zoom={12} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitRoute spots={spots} userPosition={userPosition} fitSignal={fitSignal} />
          <SpotFocus selectedSpot={selectedSpot} markerRef={markerRef} />

          {routePath.length > 1 ? <Polyline positions={routePath} color="#7a1338" weight={4} /> : null}

          {spots.map((spot) => (
            <Marker
              key={spot.id}
              position={[spot.lat, spot.lng]}
              icon={markerIcon}
              ref={(instance) => {
                if (instance) markerRef.current[spot.id] = instance;
              }}
              eventHandlers={{
                click: () => onSpotSelect?.(spot.id)
              }}
            >
              <Popup>
                <strong>{spot.time} - {spot.name}</strong>
                <br />
                {spot.category}
                <br />
                {spot.description}
              </Popup>
            </Marker>
          ))}

          {userPosition ? (
            <CircleMarker
              center={[userPosition.lat, userPosition.lng]}
              radius={9}
              pathOptions={{ color: "#1d4ed8", fillColor: "#3b82f6", fillOpacity: 0.8 }}
            >
              <Popup>Your current location</Popup>
            </CircleMarker>
          ) : null}
        </MapContainer>
      </div>

      <p className="mt-3 text-xs text-[#b9a3b6]">
        Tip: Use the spot locator dropdown or click a timeline chip to jump to that location instantly.
      </p>
    </div>
  );
}
