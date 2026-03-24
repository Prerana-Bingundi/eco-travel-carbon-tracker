import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale, RadialLinearScale,
  Tooltip, Legend, Filler
} from "chart.js";
import { Doughnut, Bar, Line, PolarArea } from "react-chartjs-2";

ChartJS.register(
  ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale, RadialLinearScale,
  Tooltip, Legend, Filler
);

// ─── Data ────────────────────────────────────────────────────────────────────

const CITIES = [
  { name: "Mumbai", lat: 19.076, lon: 72.877 },
  { name: "Delhi", lat: 28.613, lon: 77.209 },
  { name: "Bangalore", lat: 12.971, lon: 77.594 },
  { name: "Chennai", lat: 13.083, lon: 80.270 },
  { name: "Kolkata", lat: 22.572, lon: 88.363 },
  { name: "Hyderabad", lat: 17.385, lon: 78.486 },
  { name: "Pune", lat: 18.520, lon: 73.856 },
  { name: "Ahmedabad", lat: 23.022, lon: 72.571 },
  { name: "Jaipur", lat: 26.912, lon: 75.787 },
  { name: "Goa", lat: 15.299, lon: 74.124 },
  { name: "London", lat: 51.507, lon: -0.127 },
  { name: "Paris", lat: 48.856, lon: 2.352 },
  { name: "New York", lat: 40.712, lon: -74.005 },
  { name: "Tokyo", lat: 35.689, lon: 139.691 },
  { name: "Dubai", lat: 25.204, lon: 55.270 },
  { name: "Singapore", lat: 1.352, lon: 103.819 },
  { name: "Bangkok", lat: 13.756, lon: 100.502 },
  { name: "Sydney", lat: -33.868, lon: 151.209 },
  { name: "Toronto", lat: 43.651, lon: -79.347 },
  { name: "Berlin", lat: 52.520, lon: 13.405 },
  { name: "Rome", lat: 41.902, lon: 12.496 },
  { name: "Barcelona", lat: 41.385, lon: 2.173 },
  { name: "Amsterdam", lat: 52.370, lon: 4.895 },
  { name: "Cairo", lat: 30.044, lon: 31.235 },
  { name: "Nairobi", lat: -1.286, lon: 36.817 },
  { name: "Cape Town", lat: -33.924, lon: 18.424 },
  { name: "Los Angeles", lat: 34.052, lon: -118.243 },
  { name: "Chicago", lat: 41.878, lon: -87.629 },
  { name: "Mexico City", lat: 19.432, lon: -99.133 },
  { name: "Seoul", lat: 37.566, lon: 126.977 },
  { name: "Beijing", lat: 39.904, lon: 116.407 },
  { name: "Shanghai", lat: 31.230, lon: 121.473 },
  { name: "Hong Kong", lat: 22.319, lon: 114.169 },
  { name: "Zurich", lat: 47.376, lon: 8.541 },
  { name: "Vienna", lat: 48.208, lon: 16.373 },
  { name: "Istanbul", lat: 41.008, lon: 28.978 },
  { name: "Kuala Lumpur", lat: 3.140, lon: 101.686 },
  { name: "Jakarta", lat: -6.200, lon: 106.816 },
  { name: "Sao Paulo", lat: -23.550, lon: -46.633 },
  { name: "Buenos Aires", lat: -34.603, lon: -58.381 },
  { name: "Moscow", lat: 55.755, lon: 37.617 },
  { name: "Prague", lat: 50.075, lon: 14.437 },
];

const TRANSPORT_OPTIONS = [
  { val: "flight", name: "Flight (economy)", co2: 0.255, barW: 100, color: "#c0392b" },
  { val: "car", name: "Car (petrol)", co2: 0.171, barW: 67, color: "#e67e22" },
  { val: "train", name: "Train", co2: 0.041, barW: 16, color: "#2d8a2d" },
  { val: "bus", name: "Bus / Coach", co2: 0.027, barW: 11, color: "#1d9e75" },
  { val: "ev", name: "Electric car", co2: 0.053, barW: 21, color: "#27ae60" },
  { val: "cycle", name: "Cycle / Walk", co2: 0.000, barW: 1, color: "#0f6e56" },
];

const ACCOM_OPTIONS = [
  { val: "hotel5", name: "5-star hotel", co2: 60, barW: 100, color: "#c0392b" },
  { val: "hotel3", name: "3-star hotel", co2: 30, barW: 50, color: "#e67e22" },
  { val: "airbnb", name: "Shared apartment", co2: 18, barW: 30, color: "#f0c040" },
  { val: "hostel", name: "Hostel / Dorm", co2: 10, barW: 17, color: "#2d8a2d" },
  { val: "ecolodge", name: "Eco-lodge", co2: 5, barW: 8, color: "#1d9e75" },
  { val: "camping", name: "Camping / Tent", co2: 2, barW: 3, color: "#0f6e56" },
];

const ACTIVITY_OPTIONS = [
  { val: "city", name: "City sightseeing", co2: 12, barW: 27, color: "#e67e22" },
  { val: "safari", name: "Safari / Jeep tour", co2: 45, barW: 100, color: "#c0392b" },
  { val: "beach", name: "Beach / snorkel", co2: 8, barW: 18, color: "#378add" },
  { val: "hiking", name: "Hiking / trekking", co2: 3, barW: 7, color: "#2d8a2d" },
  { val: "boat", name: "Boat / cruise trip", co2: 22, barW: 49, color: "#e67e22" },
  { val: "museum", name: "Museum / culture", co2: 6, barW: 13, color: "#7f77dd" },
  { val: "skiing", name: "Skiing / snow", co2: 18, barW: 40, color: "#85b7eb" },
  { val: "cycling", name: "Cycling / walk tour", co2: 1, barW: 2, color: "#0f6e56" },
];

const AVG_TRIP = 0.85;
const TREE_PER_TON = 46;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getScore(t) {
  if (t < 0.3) return { label: "A+ Excellent", color: "#1e7a1e" };
  if (t < 0.6) return { label: "B Good", color: "#2d8a2d" };
  if (t < 1.0) return { label: "C Average", color: "#b07800" };
  if (t < 1.5) return { label: "D High", color: "#b03030" };
  return { label: "E Very High", color: "#8b0000" };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CityInput({ label, value, onChange, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  function handleInput(e) {
    const v = e.target.value;
    onChange(v);
    if (v.length > 0) {
      const matches = CITIES.filter((c) =>
        c.name.toLowerCase().startsWith(v.toLowerCase())
      ).slice(0, 6);
      setSuggestions(matches);
      setOpen(matches.length > 0);
    } else {
      setOpen(false);
    }
  }

  function pick(city) {
    onChange(city.name);
    onSelect(city);
    setOpen(false);
  }

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, fontWeight: 600 }}>
        {label}
      </div>
      <input
        value={value}
        onChange={handleInput}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={label === "From" ? "e.g. Mumbai" : "e.g. Paris"}
        style={{
          width: "100%", padding: "10px 12px",
          border: "1.5px solid #d1d5db", borderRadius: 8,
          fontSize: 13, background: "#fff", color: "#111",
          outline: "none", fontFamily: "inherit",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#2d8a2d")}
        onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; setTimeout(() => setOpen(false), 200); }}
      />
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "#fff", border: "1px solid #d1d5db", borderRadius: 8,
          zIndex: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", marginTop: 3,
          overflow: "hidden",
        }}>
          {suggestions.map((c) => (
            <div
              key={c.name}
              onMouseDown={() => pick(c)}
              style={{
                padding: "9px 14px", fontSize: 13, cursor: "pointer",
                color: "#111", borderBottom: "0.5px solid #f3f4f6",
                transition: "background 0.1s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#f0faf0")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
            >
              {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OptionCard({ item, selected, onClick, unitLabel }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: selected ? "2px solid #2d8a2d" : "1.5px solid #e5e7eb",
        borderRadius: 10, padding: "10px 12px", cursor: "pointer",
        background: selected ? "#f0faf0" : "#fff",
        transition: "all 0.15s",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{item.name}</div>
      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
        {item.co2} {unitLabel}
      </div>
      <div style={{ height: 4, background: "#f3f4f6", borderRadius: 2, marginTop: 6 }}>
        <div style={{ height: 4, borderRadius: 2, width: `${item.barW}%`, background: item.color }} />
      </div>
    </div>
  );
}

function ImpactBar({ label, val, total, color }) {
  const pct = total > 0 ? Math.round((val / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: "#374151", fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 700, color: "#111" }}>{Math.round(val * 1000)} kg CO₂</span>
      </div>
      <div style={{ height: 12, background: "#f3f4f6", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ height: 12, borderRadius: 6, width: `${pct}%`, background: color, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function EcoScaleBar({ pp }) {
  const bands = [
    { l: "A+", max: 0.3, color: "#1e7a1e" },
    { l: "B", max: 0.6, color: "#2d8a2d" },
    { l: "C", max: 1.0, color: "#b07800" },
    { l: "D", max: 1.5, color: "#b03030" },
    { l: "E", max: 99, color: "#8b0000" },
  ];
  const clamp = Math.min(pp, 2);
  const pct = Math.min((clamp / 2) * 100, 100);
  const cur = bands.find((b) => pp <= b.max) || bands[4];
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6b7280", marginBottom: 4 }}>
        {bands.map((b) => <span key={b.l}>{b.l}</span>)}
      </div>
      <div style={{ height: 18, background: "#f3f4f6", borderRadius: 9, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, height: "100%", display: "flex", width: "100%" }}>
          {bands.map((b) => (
            <div key={b.l} style={{ flex: 1, background: b.color + "22", borderRight: "1px solid #fff" }} />
          ))}
        </div>
        <div style={{
          position: "absolute", top: 0, left: 0, height: "100%",
          width: `${Math.round(pct)}%`, background: cur.color,
          borderRadius: 9, transition: "width 0.4s", opacity: 0.85,
        }} />
      </div>
      <div style={{ fontSize: 12, color: cur.color, fontWeight: 700, marginTop: 5 }}>
        Your trip: {pp.toFixed(2)}t — Grade {cur.l}
      </div>
    </div>
  );
}

function SectionDivider({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "1.5rem 0 1rem", fontSize: 13, fontWeight: 700, color: "#1a4d1a" }}>
      {children}
      <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
    </div>
  );
}

function CardBox({ title, children, style = {} }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.1rem", ...style }}>
      {title && (
        <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #f3f4f6" }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CO2TripSimulatorV2() {
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeErr, setRouteErr] = useState("");

  const [distance, setDistance] = useState(1000);
  const [travellers, setTravellers] = useState(1);
  const [nights, setNights] = useState(5);
  const [transport, setTransport] = useState(TRANSPORT_OPTIONS[0]);
  const [accom, setAccom] = useState(ACCOM_OPTIONS[0]);
  const [activities, setActivities] = useState([ACTIVITY_OPTIONS[0]]);

  function calcDistance() {
    setRouteErr(""); setRouteInfo(null);
    const c1 = CITIES.find((c) => c.name.toLowerCase() === origin.toLowerCase());
    const c2 = CITIES.find((c) => c.name.toLowerCase() === dest.toLowerCase());
    if (!origin || !dest) { setRouteErr("Please enter both cities."); return; }
    if (!c1) { setRouteErr(`"${origin}" not found. Pick from suggestions.`); return; }
    if (!c2) { setRouteErr(`"${dest}" not found. Pick from suggestions.`); return; }
    if (c1.name === c2.name) { setRouteErr("Source and destination cannot be the same."); return; }
    const dist = haversine(c1.lat, c1.lon, c2.lat, c2.lon);
    setDistance(dist);
    const suggest = dist < 200 ? "Bus or Train" : dist < 800 ? "Train" : dist < 2000 ? "Train or Flight" : "Flight";
    setRouteInfo({ from: c1.name, to: c2.name, dist, suggest });
  }

  function toggleActivity(item) {
    setActivities((prev) =>
      prev.find((a) => a.val === item.val)
        ? prev.filter((a) => a.val !== item.val)
        : [...prev, item]
    );
  }

  // ── Calculations ──
  const tCO2 = (transport.co2 * distance * 2) / 1000;
  const aCO2 = (accom.co2 * nights) / 1000;
  const actCO2 = (activities.reduce((s, a) => s + a.co2, 0) * nights) / 1000;
  const total = tCO2 + aCO2 + actCO2;
  const pp = total / travellers;
  const vs = ((pp / AVG_TRIP - 1) * 100);
  const score = getScore(pp);
  const greenTotal = (0.041 * distance * 2) / 1000 / travellers + (5 * nights) / 1000 + (4 * nights) / 1000;

  // ── Chart data ──

  const donutData = {
    labels: ["Transport", "Accommodation", "Activities"],
    datasets: [{
      data: [
        parseFloat((tCO2 / travellers * 1000).toFixed(1)),
        parseFloat((aCO2 * 1000).toFixed(1)),
        parseFloat((actCO2 * 1000).toFixed(1)),
      ],
      backgroundColor: ["#c0392b", "#e67e22", "#378add"],
      borderWidth: 3, borderColor: "#fff",
    }],
  };

  const compareData = {
    labels: ["Your trip", "Greener alt.", "Avg trip"],
    datasets: [{
      data: [parseFloat(pp.toFixed(3)), parseFloat(greenTotal.toFixed(3)), AVG_TRIP],
      backgroundColor: ["#c0392b", "#2d8a2d", "#9ca3af"],
      borderRadius: 6,
    }],
  };

  const transportBarData = {
    labels: ["Flight", "Car", "Train", "Bus", "E-Car", "Cycle"],
    datasets: [{
      label: "kg CO₂/km",
      data: [0.255, 0.171, 0.041, 0.027, 0.053, 0],
      backgroundColor: ["#c0392b", "#e67e22", "#2d8a2d", "#1d9e75", "#27ae60", "#0f6e56"],
      borderRadius: 5,
    }],
  };

  const nightsArr = Array.from({ length: 14 }, (_, i) => i + 1);
  const lineData = {
    labels: nightsArr,
    datasets: [
      {
        label: "Your trip",
        data: nightsArr.map((n) =>
          parseFloat(((transport.co2 * distance * 2) / 1000 + (accom.co2 * n) / 1000 + (activities.reduce((s, a) => s + a.co2, 0) * n) / 1000).toFixed(3) / travellers)
        ),
        borderColor: "#c0392b", backgroundColor: "rgba(192,57,43,0.08)",
        tension: 0.35, fill: true, pointRadius: 3, pointBackgroundColor: "#c0392b",
      },
      {
        label: "Greener",
        data: nightsArr.map((n) =>
          parseFloat(((0.041 * distance * 2) / 1000 + (5 * n) / 1000 + (4 * n) / 1000).toFixed(3) / travellers)
        ),
        borderColor: "#2d8a2d", backgroundColor: "rgba(45,138,45,0.08)",
        tension: 0.35, fill: true, pointRadius: 3, pointBackgroundColor: "#2d8a2d",
      },
    ],
  };

  const accomLabels = ["5-star", "3-star", "Apartment", "Hostel", "Eco-lodge", "Camping"];
  const accomCo2 = [60, 30, 18, 10, 5, 2];
  const tPerNight = parseFloat(((transport.co2 * distance * 2) / 1000 / nights / travellers * 1000).toFixed(1));
  const actPerDay = parseFloat((activities.reduce((s, a) => s + a.co2, 0)).toFixed(1));
  const stackedData = {
    labels: accomLabels,
    datasets: [
      { label: "Transport/night", data: Array(6).fill(tPerNight), backgroundColor: "#c0392b" },
      { label: "Accommodation", data: accomCo2, backgroundColor: "#e67e22" },
      { label: "Activities", data: Array(6).fill(actPerDay), backgroundColor: "#378add" },
    ],
  };

  const allActs = [
    { n: "City", v: 12 }, { n: "Safari", v: 45 }, { n: "Beach", v: 8 },
    { n: "Hiking", v: 3 }, { n: "Boat", v: 22 }, { n: "Museum", v: 6 },
    { n: "Skiing", v: 18 }, { n: "Cycling", v: 1 },
  ];
  const polarColors = ["#e67e22cc","#c0392bcc","#378addcc","#2d8a2dcc","#e67e22cc","#7f77ddcc","#85b7ebcc","#0f6e56cc"];
  const polarData = {
    labels: allActs.map((a) => a.n),
    datasets: [{
      data: allActs.map((a) => a.v),
      backgroundColor: polarColors,
      borderColor: polarColors.map((c) => c.slice(0, 7)),
      borderWidth: 1,
    }],
  };

  const activityBarData = {
    labels: activities.length ? activities.map((a) => a.name) : ["None selected"],
    datasets: [{
      label: "kg CO₂/day",
      data: activities.length ? activities.map((a) => a.co2) : [0],
      backgroundColor: activities.map((_, i) =>
        ["#e67e22","#c0392b","#378add","#2d8a2d","#e67e22","#7f77dd","#85b7eb","#0f6e56"][i % 8]
      ),
      borderRadius: 5,
    }],
  };

  // ── Chart options helpers ──
  const baseOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
  const barOpts = { ...baseOpts, scales: { y: { ticks: { font: { size: 10 } }, grid: { color: "rgba(0,0,0,0.05)" } }, x: { ticks: { font: { size: 10 } }, grid: { display: false } } } };

  // ── Recommendations ──
  const recs = [];
  const rs = {
    good: { bg: "#f0faf0", br: "#9fca9f", tc: "#1e5c1e", dc: "#3b6d11" },
    warn: { bg: "#fff8ee", br: "#e0c070", tc: "#6b4000", dc: "#7a5000" },
    bad:  { bg: "#fff0f0", br: "#e09090", tc: "#7a1c1c", dc: "#8a2020" },
  };
  if (tCO2 / travellers > 0.4)
    recs.push({ cls: "bad", icon: "✈️", title: "Switch to train or bus", desc: "Rail emits up to 90% less CO₂ than flying for the same route." });
  else if (tCO2 / travellers > 0.15)
    recs.push({ cls: "warn", icon: "🚗", title: "Try an electric vehicle", desc: "Electric cars cut emissions by ~70% vs petrol, especially on shorter trips." });
  else
    recs.push({ cls: "good", icon: "🌿", title: "Great transport choice!", desc: "You are already using a low-carbon mode. Your trip footprint is on the right track." });

  if (aCO2 > 0.04)
    recs.push({ cls: "warn", icon: "🏨", title: "Choose greener lodging", desc: "Eco-lodges and hostels emit up to 95% less than luxury hotels. Ask about renewable energy." });
  else
    recs.push({ cls: "good", icon: "🏕️", title: "Sustainable stay!", desc: "Your accommodation is one of the lowest-impact options. Well done." });

  if (pp < 0.5)
    recs.push({ cls: "good", icon: "🌱", title: "Offset the rest", desc: `Plant ${Math.ceil(pp * TREE_PER_TON)} trees or donate to a Gold Standard certified carbon offset project.` });
  else
    recs.push({ cls: "warn", icon: "🌲", title: "Offset your footprint", desc: `You need ~${Math.ceil(pp * TREE_PER_TON)} trees. Consider Gold Standard or Verra certified offset schemes.` });

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f4f7f4", minHeight: "100vh", padding: "1.5rem" }}>

      {/* Header */}
      <div style={{ background: "#1a4d1a", borderRadius: 14, padding: "1.25rem 1.75rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>🌿 CO₂ Trip Simulator</h1>
          <p style={{ color: "#86efac", fontSize: 12, margin: "4px 0 0", fontWeight: 400 }}>Build your trip · See your impact · Choose greener</p>
        </div>
        <div style={{ background: "#2d6e2d", color: "#a7f3a7", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 20 }}>Educational Tool</div>
      </div>

      {/* Route Planner */}
      <CardBox style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #f3f4f6" }}>Plan your route</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <CityInput label="From" value={origin} onChange={setOrigin} onSelect={() => setRouteInfo(null)} />
          <div style={{ paddingBottom: 8, flexShrink: 0 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2d8a2d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" />
            </svg>
          </div>
          <CityInput label="To" value={dest} onChange={setDest} onSelect={() => setRouteInfo(null)} />
          <button onClick={calcDistance} style={{ padding: "10px 20px", background: "#2d8a2d", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
            Calculate distance
          </button>
        </div>
        {routeErr && <p style={{ color: "#b03030", fontSize: 12, marginTop: 8 }}>{routeErr}</p>}
        {routeInfo && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12, padding: "10px 14px", background: "#f0faf0", borderRadius: 8, fontSize: 12 }}>
            <span style={{ color: "#374151" }}>Route: <strong style={{ color: "#1a4d1a" }}>{routeInfo.from} → {routeInfo.to}</strong></span>
            <span style={{ color: "#374151" }}>Distance: <strong style={{ color: "#1a4d1a" }}>{routeInfo.dist.toLocaleString()} km</strong></span>
            <span style={{ color: "#374151" }}>Suggested: <strong style={{ color: "#1a4d1a" }}>{routeInfo.suggest}</strong></span>
          </div>
        )}
      </CardBox>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10, marginBottom: "1.25rem" }}>
        {[
          { label: "Total trip CO₂", val: pp.toFixed(2) + " t", color: pp > 1 ? "#b03030" : pp > 0.6 ? "#b07800" : "#1e7a1e" },
          { label: "vs avg tourist trip", val: (vs >= 0 ? "+" : "") + Math.round(vs) + "%", color: vs > 20 ? "#b03030" : vs < -20 ? "#1e7a1e" : "#b07800" },
          { label: "Trees to offset", val: Math.ceil(pp * TREE_PER_TON).toString(), color: "#374151" },
          { label: "Eco score", val: score.label, color: score.color },
        ].map((k, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "0.9rem 1rem" }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, fontWeight: 600 }}>{k.label}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: k.color, letterSpacing: "-0.5px" }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* Transport + Accom */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: "1.25rem" }}>
        <CardBox title="Transport mode">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {TRANSPORT_OPTIONS.map((item) => (
              <OptionCard key={item.val} item={item} selected={transport.val === item.val} onClick={() => setTransport(item)} unitLabel="kg CO₂/km" />
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            {[
              { label: "Distance (km)", min: 10, max: 15000, step: 10, val: distance, set: setDistance, fmt: (v) => v.toLocaleString() + " km" },
              { label: "Travellers", min: 1, max: 8, step: 1, val: travellers, set: setTravellers, fmt: (v) => v },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: "#6b7280", minWidth: 100, fontWeight: 600 }}>{s.label}</label>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
                  onChange={(e) => s.set(parseInt(e.target.value))} style={{ flex: 1, accentColor: "#2d8a2d" }} />
                <span style={{ fontSize: 12, fontWeight: 700, minWidth: 65, textAlign: "right", color: "#111" }}>{s.fmt(s.val)}</span>
              </div>
            ))}
          </div>
        </CardBox>

        <CardBox title="Accommodation">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {ACCOM_OPTIONS.map((item) => (
              <OptionCard key={item.val} item={item} selected={accom.val === item.val} onClick={() => setAccom(item)} unitLabel="kg CO₂/night" />
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ fontSize: 11, color: "#6b7280", minWidth: 100, fontWeight: 600 }}>Nights</label>
              <input type="range" min={1} max={30} step={1} value={nights}
                onChange={(e) => setNights(parseInt(e.target.value))} style={{ flex: 1, accentColor: "#2d8a2d" }} />
              <span style={{ fontSize: 12, fontWeight: 700, minWidth: 65, textAlign: "right", color: "#111" }}>{nights} night{nights !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </CardBox>
      </div>

      {/* Activities */}
      <CardBox style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #f3f4f6" }}>
          Tourist activities <span style={{ fontWeight: 400, textTransform: "none", color: "#9ca3af" }}>(select multiple)</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 8 }}>
          {ACTIVITY_OPTIONS.map((item) => (
            <OptionCard key={item.val} item={item} selected={!!activities.find((a) => a.val === item.val)} onClick={() => toggleActivity(item)} unitLabel="kg CO₂/day" />
          ))}
        </div>
      </CardBox>

      <SectionDivider>📊 Charts & Analysis</SectionDivider>

      {/* Row 1: Donut + Compare + Transport Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
        <CardBox title="Emission breakdown">
          <div style={{ position: "relative", width: "100%", height: 180 }}>
            <Doughnut data={donutData} options={{ ...baseOpts, cutout: "60%", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw} kg CO₂` } } } }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10, fontSize: 11, color: "#6b7280" }}>
            {["#c0392b","#e67e22","#378add"].map((c, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: c, display: "inline-block" }} />
                {["Transport","Accommodation","Activities"][i]}
              </span>
            ))}
          </div>
        </CardBox>

        <CardBox title="Compare alternatives">
          <div style={{ position: "relative", width: "100%", height: 180 }}>
            <Bar data={compareData} options={{ ...barOpts, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.raw.toFixed(2)} t CO₂` } } } }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8, fontSize: 11, color: "#6b7280", flexWrap: "wrap" }}>
            {[["#c0392b","Your trip"],["#2d8a2d","Greener"],["#9ca3af","Avg trip"]].map(([c,l],i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: c, display: "inline-block" }} />{l}</span>
            ))}
          </div>
        </CardBox>

        <CardBox title="Transport CO₂ per km">
          <div style={{ position: "relative", width: "100%", height: 180 }}>
            <Bar data={transportBarData} options={{ ...barOpts, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.raw} kg CO₂/km` } } } }} />
          </div>
        </CardBox>
      </div>

      {/* Row 2: Impact bars + Line chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <CardBox title="Trip impact breakdown">
          <ImpactBar label="Transport" val={tCO2 / travellers} total={pp} color="#c0392b" />
          <ImpactBar label="Accommodation" val={aCO2} total={pp} color="#e67e22" />
          <ImpactBar label="Activities" val={actCO2} total={pp} color="#378add" />
          <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 16, marginBottom: 10 }}>
            Daily activity emissions
          </div>
          <div style={{ position: "relative", width: "100%", height: 150 }}>
            <Bar data={activityBarData} options={{ ...barOpts, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.raw} kg CO₂/day` } } } }} />
          </div>
        </CardBox>

        <CardBox title="CO₂ vs trip duration (nights)">
          <div style={{ position: "relative", width: "100%", height: 190 }}>
            <Line data={lineData} options={{ ...barOpts, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw.toFixed(2)} t` } } } }} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 11, color: "#6b7280" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: "#c0392b", display: "inline-block" }} />Your trip</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: "#2d8a2d", display: "inline-block" }} />Greener alt.</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 16, marginBottom: 6 }}>Eco score scale</div>
          <EcoScaleBar pp={pp} />
        </CardBox>
      </div>

      {/* Row 3: Stacked + Polar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <CardBox title="Stacked CO₂ per night by accommodation">
          <div style={{ position: "relative", width: "100%", height: 220 }}>
            <Bar data={stackedData} options={{ ...barOpts, scales: { x: { stacked: true, ticks: { font: { size: 9 } }, grid: { display: false } }, y: { stacked: true, ticks: { font: { size: 9 }, callback: (v) => v + "kg" }, grid: { color: "rgba(0,0,0,0.05)" }, title: { display: true, text: "kg CO₂/night", font: { size: 10 } } } }, plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } } }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8, fontSize: 11, color: "#6b7280", flexWrap: "wrap" }}>
            {[["#c0392b","Transport"],["#e67e22","Accommodation"],["#378add","Activities"]].map(([c,l],i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: c, display: "inline-block" }} />{l}</span>
            ))}
          </div>
        </CardBox>

        <CardBox title="Activity impact — polar area">
          <div style={{ position: "relative", width: "100%", height: 220 }}>
            <PolarArea data={polarData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "right", labels: { font: { size: 9 }, boxWidth: 10 } } }, scales: { r: { ticks: { font: { size: 8 } } } } }} />
          </div>
        </CardBox>
      </div>

      <SectionDivider>💡 Recommendations</SectionDivider>

      {/* Recs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 12, marginBottom: "1.25rem" }}>
        {recs.map((r, i) => {
          const s = rs[r.cls];
          return (
            <div key={i} style={{ background: s.bg, border: `1px solid ${s.br}`, borderRadius: 12, padding: "1rem" }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{r.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.tc, marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: s.dc, lineHeight: 1.6 }}>{r.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Footer tip */}
      <div style={{ background: "#f0faf0", border: "1px solid #9fca9f", borderRadius: 10, padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#1a4d1a", marginBottom: "1rem" }}>
        <span style={{ fontSize: 16 }}>🚌</span>
        <span><strong>Sustainable Travel Tip:</strong> Choose trains or buses over flights to reduce your carbon footprint. Stay in eco-certified lodgings and pick low-impact activities.</span>
      </div>
    </div>
  );
}