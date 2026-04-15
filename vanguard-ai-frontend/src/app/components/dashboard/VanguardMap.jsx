'use client';

import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { Globe, Shield, AlertTriangle, Truck, Zap, Wifi, WifiOff } from 'lucide-react';

// ─── VANGUARD Enterprise Node Network ─────────────────────────────────────────
const NODES = [
  {
    id: 1,
    lat: 37.7749, lng: -122.4194,
    label: 'APAC Hub Alpha',
    type: 'healthy',
    status: 'NOMINAL',
    detail: 'San Francisco · Supply Chain Core · 99.8% uptime',
    icon: 'supply',
  },
  {
    id: 2,
    lat: 51.5074, lng: -0.1278,
    label: 'EU Operations',
    type: 'healthy',
    status: 'SECURED',
    detail: 'London · Asset Vault Node · AES-256 Active',
    icon: 'asset',
  },
  {
    id: 3,
    lat: 35.6762, lng: 139.6503,
    label: 'Tokyo Relay Node',
    type: 'warning',
    status: 'DEGRADED',
    detail: 'Tokyo · Logistics Hub · 400ms elevated latency',
    icon: 'supply',
  },
  {
    id: 4,
    lat: 1.3521, lng: 103.8198,
    label: 'SEA Crisis Zone',
    type: 'crisis',
    status: 'CRITICAL',
    detail: 'Singapore · Cyber intrusion detected · Response active',
    icon: 'crisis',
  },
  {
    id: 5,
    lat: 28.6139, lng: 77.2090,
    label: 'INDIA Asset Node',
    type: 'healthy',
    status: 'SECURED',
    detail: 'New Delhi · Digital Asset Cluster · Encrypted',
    icon: 'asset',
  },
  {
    id: 6,
    lat: -33.8688, lng: 151.2093,
    label: 'AU Logistics Hub',
    type: 'warning',
    status: 'WARNING',
    detail: 'Sydney · Supply disruption · Rerouting active',
    icon: 'supply',
  },
  {
    id: 7,
    lat: 48.8566, lng: 2.3522,
    label: 'EU Crisis Node',
    type: 'crisis',
    status: 'CRISIS',
    detail: 'Paris · Physical breach alert · Lockdown initiated',
    icon: 'crisis',
  },
  {
    id: 8,
    lat: 40.7128, lng: -74.0060,
    label: 'Americas Core',
    type: 'healthy',
    status: 'OPTIMAL',
    detail: 'New York · HQ Command Center · All systems green',
    icon: 'asset',
  },
  {
    id: 9,
    lat: -23.5505, lng: -46.6333,
    label: 'LATAM Node',
    type: 'healthy',
    status: 'SECURED',
    detail: 'São Paulo · Regional Logistics · Stable',
    icon: 'supply',
  },
  {
    id: 10,
    lat: 55.7558, lng: 37.6173,
    label: 'EMEA Relay',
    type: 'warning',
    status: 'MONITORING',
    detail: 'Moscow · Data relay node · Elevated risk level',
    icon: 'supply',
  },
];

const STATUS_COLORS = {
  healthy: '#10b981',
  warning: '#f59e0b',
  crisis:  '#ef4444',
};

const CIRCLE_COLORS = {
  healthy: 'rgba(16,185,129,',
  warning: 'rgba(245,158,11,',
  crisis:  'rgba(239,68,68,',
};

// Dark map style for VANGUARD theme
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#516075' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1117' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
  { featureType: 'landscape', stylers: [{ color: '#080f27' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#243248' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', stylers: [{ color: '#04091a' }] },
];

const LIGHT_MAP_STYLE = [
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f1f5f9' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#e2e8f0' }] },
  { featureType: 'water', stylers: [{ color: '#bfdbfe' }] },
  { featureType: 'landscape', stylers: [{ color: '#f8fafc' }] },
];

const MAP_CENTER = { lat: 20, lng: 10 };

const LIBRARIES = ['marker'];

export default function VanguardMap({ isDark = true }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const mapRef = useRef(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const hasKey = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_KEY_HERE';

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: hasKey ? apiKey : '',
    libraries: LIBRARIES,
  });

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const filteredNodes = NODES.filter(n => filter === 'all' || n.type === filter);

  const counts = {
    healthy: NODES.filter(n => n.type === 'healthy').length,
    warning: NODES.filter(n => n.type === 'warning').length,
    crisis:  NODES.filter(n => n.type === 'crisis').length,
  };

  // ── No API Key: show placeholder map with embedded iframe ─────────────────
  if (!hasKey) {
    return (
      <div className="glass overflow-hidden" style={{ borderRadius: 'var(--radius-xl)' }}>
        {/* Header */}
        <MapHeader isDark={isDark} filter={filter} setFilter={setFilter} counts={counts} hasKey={false} />

        {/* Embedded OpenStreetMap as fallback with node overlay */}
        <div className="relative" style={{ height: 440 }}>
          <iframe
            title="VANGUARD Node Network"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29946764.01!2d10!3d20!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block', filter: isDark ? 'invert(90%) hue-rotate(180deg) brightness(0.85) saturate(1.2)' : 'none' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          {/* Node overlays on top of iframe */}
          <NodeOverlay nodes={filteredNodes} isDark={isDark} />
          {/* Key banner */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
            style={{ background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)', border: '1px solid rgba(99,102,241,0.3)', backdropFilter: 'blur(10px)', color: isDark ? '#94a3b8' : '#475569' }}>
            <WifiOff className="w-3 h-3 text-amber-400" />
            Add <code className="text-indigo-400 mx-1">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> to .env for full interactive map
          </div>
        </div>

        <MapFooter counts={counts} />
      </div>
    );
  }

  // ── Load Error ────────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="glass p-8 text-center" style={{ borderRadius: 'var(--radius-xl)' }}>
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <p className="text-dim text-sm">Maps failed to load. Check your API key restrictions.</p>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="glass flex items-center justify-center" style={{ borderRadius: 'var(--radius-xl)', height: 520 }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-indigo-500/20 rounded-full animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-t-2 border-indigo-500 rounded-full animate-spin" style={{ animationDuration: '0.7s' }} />
          </div>
          <p className="label-xs text-indigo-400 animate-pulse">Initializing Geospatial Matrix</p>
        </div>
      </div>
    );
  }

  // ── Full Google Maps ──────────────────────────────────────────────────────
  return (
    <div className="glass overflow-hidden" style={{ borderRadius: 'var(--radius-xl)' }}>
      <MapHeader isDark={isDark} filter={filter} setFilter={setFilter} counts={counts} hasKey={true} />

      <div style={{ height: 440 }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={MAP_CENTER}
          zoom={2.5}
          onLoad={onLoad}
          options={{
            styles: isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            gestureHandling: 'cooperative',
            minZoom: 2,
          }}
        >
          {filteredNodes.map((node) => (
            <div key={node.id}>
              {/* Pulse circle */}
              <Circle
                center={{ lat: node.lat, lng: node.lng }}
                radius={node.type === 'crisis' ? 350000 : 200000}
                options={{
                  fillColor: STATUS_COLORS[node.type],
                  fillOpacity: 0.08,
                  strokeColor: STATUS_COLORS[node.type],
                  strokeOpacity: 0.4,
                  strokeWeight: 1.5,
                  clickable: false,
                }}
              />
              {/* Marker */}
              <Marker
                position={{ lat: node.lat, lng: node.lng }}
                onClick={() => setSelected(node)}
                icon={{
                  path: window.google?.maps?.SymbolPath?.CIRCLE ?? 0,
                  scale: node.type === 'crisis' ? 12 : 9,
                  fillColor: STATUS_COLORS[node.type],
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2,
                }}
              />
              {/* InfoWindow */}
              {selected?.id === node.id && (
                <InfoWindow
                  position={{ lat: node.lat, lng: node.lng }}
                  onCloseClick={() => setSelected(null)}
                >
                  <div style={{
                    background: isDark ? '#080f27' : '#ffffff',
                    fontFamily: "'Google Sans', system-ui, sans-serif",
                    minWidth: 200,
                    padding: '2px 0',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{
                        background: STATUS_COLORS[node.type],
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        color: '#fff',
                        textTransform: 'uppercase',
                      }}>{node.status}</span>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: isDark ? '#f1f5f9' : '#0d1117', margin: '0 0 4px' }}>{node.label}</p>
                    <p style={{ fontSize: 11, color: isDark ? '#64748b' : '#475569', margin: 0, lineHeight: 1.5 }}>{node.detail}</p>
                  </div>
                </InfoWindow>
              )}
            </div>
          ))}
        </GoogleMap>
      </div>

      <MapFooter counts={counts} />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function MapHeader({ isDark, filter, setFilter, counts, hasKey }) {
  const FILTERS = [
    { key: 'all',     label: 'All Nodes',  color: '#6366f1' },
    { key: 'healthy', label: 'Healthy',    color: '#10b981' },
    { key: 'warning', label: 'Warning',    color: '#f59e0b' },
    { key: 'crisis',  label: 'Crisis',     color: '#ef4444' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 pb-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.12)' }}>
          <Globe className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="font-bold text-main text-sm" style={{ fontFamily: "'Google Sans Display', sans-serif" }}>
            Planetary Topology Matrix
          </h3>
          <p className="label-xs text-dim mt-0.5">
            {hasKey ? <span className="flex items-center gap-1.5"><Wifi className="w-3 h-3 text-emerald-400" />Live Google Maps · {NODES.length} nodes</span> : 'Embedded View · Add API key for full interactivity'}
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: filter === f.key ? `${f.color}22` : 'transparent',
              border: `1px solid ${filter === f.key ? f.color + '60' : 'rgba(255,255,255,0.08)'}`,
              color: filter === f.key ? f.color : '#64748b',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: f.color }} />
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MapFooter({ counts }) {
  const items = [
    { label: 'Healthy',  count: counts.healthy, color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
    { label: 'Warning',  count: counts.warning, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
    { label: 'Critical', count: counts.crisis,  color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
  ];

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-4">
        {items.map(i => (
          <div key={i.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: i.bg }}>
            <div className="w-2 h-2 rounded-full" style={{ background: i.color, boxShadow: `0 0 6px ${i.color}` }} />
            <span className="text-xs font-semibold" style={{ color: i.color }}>{i.count} {i.label}</span>
          </div>
        ))}
      </div>
      <span className="label-xs text-dim opacity-60">VANGUARD GEOSPATIAL NODE NETWORK v9.0</span>
    </div>
  );
}

// Overlay for iframe fallback - positions dots based on lat/lng approximate percentages
function NodeOverlay({ nodes, isDark }) {
  // Approximate world map projection for the embedded iframe area
  const getPos = (lat, lng) => {
    // Mercator-like projection, adjusted for the iframe bounds
    const x = ((lng + 180) / 360) * 100;
    const latRad = lat * Math.PI / 180;
    const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
    const y = (0.5 - mercN / (2 * Math.PI)) * 100;
    return { left: `${Math.max(2, Math.min(96, x))}%`, top: `${Math.max(5, Math.min(92, y))}%` };
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {nodes.map(node => {
        const pos = getPos(node.lat, node.lng);
        const color = STATUS_COLORS[node.type];
        return (
          <div key={node.id} style={{ position: 'absolute', ...pos, transform: 'translate(-50%, -50%)' }}>
            <div style={{
              width: node.type === 'crisis' ? 14 : 10,
              height: node.type === 'crisis' ? 14 : 10,
              borderRadius: '50%',
              background: color,
              border: '2px solid white',
              boxShadow: `0 0 12px ${color}, 0 0 4px ${color}`,
              animation: node.type !== 'healthy' ? 'none' : undefined,
            }} />
          </div>
        );
      })}
    </div>
  );
}
