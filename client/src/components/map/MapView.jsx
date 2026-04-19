import React, { useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

const regionCoords = {
  North: { lat: 28.6139, lng: 77.209 },
  West: { lat: 19.076, lng: 72.8777 },
  South: { lat: 12.9716, lng: 77.5946 },
  East: { lat: 22.5726, lng: 88.3639 }
};

const dishCoords = {
  "Butter Chicken": { lat: 30.7333, lng: 76.7794 },
  "Vada Pav": { lat: 19.076, lng: 72.8777 },
  Dosa: { lat: 13.0827, lng: 80.2707 },
  "Macher Jhol": { lat: 22.5726, lng: 88.3639 }
};

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapAutoFocus({ regions, filterLabel, selectedRegion }) {
  const map = useMap();

  React.useEffect(() => {
    if (!regions.length) {
      map.setView([22.9734, 78.6569], 5);
      return;
    }

    if (selectedRegion && regionCoords[selectedRegion]) {
      const point = regionCoords[selectedRegion];
      map.setView([point.lat, point.lng], 6);
      return;
    }

    if (filterLabel !== "All Cuisines") {
      const focus = regionCoords[filterLabel] || dishCoords[filterLabel];
      if (focus) {
        map.setView([focus.lat, focus.lng], 6);
        return;
      }
    }

    const bounds = L.latLngBounds(
      regions
        .map((region) => regionCoords[region.name] || dishCoords[region.signatureDish])
        .filter(Boolean)
        .map((point) => [point.lat, point.lng])
    );

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [80, 80] });
    } else {
      map.setView([22.9734, 78.6569], 5);
    }
  }, [map, regions, filterLabel, selectedRegion]);

  return null;
}

export default function MapView({
  regions,
  filterLabel = "All Cuisines",
  selectedRegion,
  onRegionSelect
}) {
  const markers = useMemo(
    () =>
      regions
        .map((region) => ({
          ...region,
          point: regionCoords[region.name] || dishCoords[region.signatureDish]
        }))
        .filter((entry) => Boolean(entry.point)),
    [regions]
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-3xl border border-[#e8ddcf] bg-[#f8f3ea] p-4 shadow-[0_10px_25px_rgba(31,25,47,0.06)]">
        <div className="h-[320px] w-full overflow-hidden rounded-2xl sm:h-[380px] lg:h-[440px]">
          <MapContainer center={[22.9734, 78.6569]} zoom={5} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapAutoFocus regions={regions} filterLabel={filterLabel} selectedRegion={selectedRegion} />
            {markers.map((entry) => (
              <Marker
                key={entry.name}
                position={[entry.point.lat, entry.point.lng]}
                icon={selectedRegion === entry.name ? selectedIcon : defaultIcon}
                eventHandlers={{ click: () => onRegionSelect?.(entry.name) }}
              >
                <Popup>
                  <strong>{entry.name}</strong>
                  <br />
                  Signature: {entry.signatureDish}
                  <br />
                  Cities: {entry.cities.join(", ")}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="space-y-4">
        <p className="rounded-full bg-[#f7eaf0] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#7a1338]">
          Active Filter: {filterLabel}
        </p>
        {regions.length === 0 ? (
          <article className="rounded-3xl border border-[#e8ddcf] bg-white p-5 text-sm text-gray-600 shadow-[0_10px_25px_rgba(31,25,47,0.06)]">
            No regions match this filter.
          </article>
        ) : (
          regions.slice(0, 3).map((region, index) => (
            <article
              key={region.name}
              className={`cursor-pointer rounded-3xl border bg-white p-5 shadow-[0_10px_25px_rgba(31,25,47,0.06)] ${
                selectedRegion === region.name ? "border-[#7a1338]" : "border-[#e8ddcf]"
              }`}
              onClick={() => onRegionSelect?.(region.name)}
            >
              <h3 className="text-2xl font-black text-[#171433]">{region.name}</h3>
              <p className="mt-1 text-sm italic text-gray-500">{index === 0 ? '"The Land of Delights"' : '"Street Food Capital"'}</p>
              <p className="mt-2 text-sm text-gray-600">Known for {region.signatureDish.toLowerCase()} and iconic regional plates.</p>
              <div className="mt-3 space-y-2 text-sm">
                {region.cities.slice(0, 3).map((city) => (
                  <div key={city} className="rounded-xl bg-[#f7f0e8] px-3 py-2">{city}</div>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

