"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Report {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function LiveMap({ 
  reports, 
  selectedReport, 
  onSelectReport 
}: { 
  reports: Report[], 
  selectedReport: Report | null,
  onSelectReport: (report: Report) => void 
}) {
  const center: [number, number] = [22.8046, 86.2029];

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      className="z-0"
    >
      <ChangeView 
        center={selectedReport ? [selectedReport.latitude, selectedReport.longitude] : center} 
        zoom={selectedReport ? 16 : 13} 
      />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {reports.map((report) => (
        <Marker 
          key={report.id} 
          position={[report.latitude, report.longitude]}
          eventHandlers={{
            click: () => onSelectReport(report),
          }}
        >
          <Popup className="text-black font-sans">
            <strong className="text-sm">{report.title}</strong><br/>
            <span className="text-xs text-gray-600">Location Locked</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}