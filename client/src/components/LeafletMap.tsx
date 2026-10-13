import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface FacilityMapItem {
  facility_id: number;
  facility_name: string;
  facility_type: string;
  address: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
  distance_label?: string | null;
  status: string;
}

interface LeafletMapProps {
  facilities: FacilityMapItem[];
  userLat?: number | null;
  userLng?: number | null;
  radiusKm?: number;
  height?: string;
  onSelectFacility?: (facilityId: number) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  facilities,
  userLat,
  userLng,
  radiusKm = 25,
  height = '500px',
  onSelectFacility,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map
      const defaultCenter: [number, number] = userLat && userLng
        ? [userLat, userLng]
        : facilities.length > 0
        ? [facilities[0].latitude, facilities[0].longitude]
        : [28.6139, 77.2090]; // Delhi NCR default

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: userLat && userLng ? 12 : 11,
        scrollWheelZoom: true,
      });

      // Free OpenStreetMap tile layer (no API key required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const bounds: [number, number][] = [];

    // Render User Location marker & Radius circle if coords provided
    if (userLat && userLng && !isNaN(userLat) && !isNaN(userLng)) {
      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: `<div style="
          width: 20px;
          height: 20px;
          background: #0284c7;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(2, 132, 199, 0.6);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const userMarker = L.marker([userLat, userLng], { icon: userIcon }).bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
          <b style="color: #0284c7;">Your Location</b><br/>
          <span>Radius: ${radiusKm} km</span>
        </div>`
      );
      layer.addLayer(userMarker);
      bounds.push([userLat, userLng]);

      // Radius circle
      const radiusCircle = L.circle([userLat, userLng], {
        radius: radiusKm * 1000,
        color: '#0284c7',
        fillColor: '#38bdf8',
        fillOpacity: 0.1,
        weight: 1.5,
      });
      layer.addLayer(radiusCircle);
    }

    // Colors for different healthcare types
    const getColor = (type: string) => {
      switch (type) {
        case 'HOSPITAL':
          return '#dc2626'; // Red
        case 'CLINIC':
          return '#059669'; // Emerald
        case 'PHARMACY':
          return '#0284c7'; // Sky
        case 'DIAGNOSTIC_CENTRE':
          return '#7c3aed'; // Purple
        case 'BLOOD_CENTRE':
          return '#b91c1c'; // Dark Red
        case 'LABORATORY':
          return '#ea580c'; // Amber Orange
        default:
          return '#475569'; // Slate
      }
    };

    // Add Facility Markers
    facilities.forEach((fac) => {
      if (fac.latitude && fac.longitude) {
        bounds.push([fac.latitude, fac.longitude]);
        const color = getColor(fac.facility_type);

        const customIcon = L.divIcon({
          className: 'custom-facility-pin',
          html: `<div style="
            background-color: ${color};
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            border: 2px solid white;
          ">
            <span style="transform: rotate(45deg); font-size: 14px; font-weight: bold;">✚</span>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const popupContent = `
          <div style="font-family: 'Inter', sans-serif; min-width: 200px; padding: 4px;">
            <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: ${color};">
              ${fac.facility_type.replace('_', ' ')}
            </span>
            <h4 style="margin: 4px 0 2px 0; font-size: 14px; font-weight: 700; color: #0f172a;">
              ${fac.facility_name}
            </h4>
            <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">
              ${fac.address}, ${fac.city}
            </p>
            ${
              fac.distance_label
                ? `<div style="display: inline-block; background: #f0fdf4; color: #166534; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; margin-bottom: 8px;">
                    ${fac.distance_label}
                  </div>`
                : ''
            }
            <div style="margin-top: 6px; border-top: 1px solid #f1f5f9; padding-top: 6px;">
              <a href="/facility/${fac.facility_id}" style="display: block; text-align: center; background: #0f172a; color: white; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none;">
                View Facility Details & Costs
              </a>
            </div>
          </div>
        `;

        const marker = L.marker([fac.latitude, fac.longitude], { icon: customIcon }).bindPopup(
          popupContent
        );
        layer.addLayer(marker);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [facilities, userLat, userLng, radiusKm]);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-10" />

      {/* Legend overlay */}
      <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-100 text-xs font-medium space-y-1.5 hidden sm:block">
        <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
          Map Legend
        </p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#dc2626]"></span>
          <span>Hospital</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#059669]"></span>
          <span>Clinic</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#7c3aed]"></span>
          <span>Diagnostic</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0284c7]"></span>
          <span>Pharmacy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ea580c]"></span>
          <span>Laboratory</span>
        </div>
      </div>
    </div>
  );
};
