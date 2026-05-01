import { HeartPulse, Thermometer, Activity, Droplets, Weight } from "lucide-react";

const vitals = [
  { label: "Heart Rate", value: "—", unit: "bpm", icon: HeartPulse, color: "text-red-400", bg: "bg-red-500/10", normal: "60–100 bpm" },
  { label: "Blood Pressure", value: "—", unit: "mmHg", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10", normal: "120/80 mmHg" },
  { label: "Temperature", value: "—", unit: "°C", icon: Thermometer, color: "text-orange-400", bg: "bg-orange-500/10", normal: "36.1–37.2 °C" },
  { label: "Blood Glucose", value: "—", unit: "mg/dL", icon: Droplets, color: "text-purple-400", bg: "bg-purple-500/10", normal: "70–100 mg/dL" },
  { label: "Weight", value: "—", unit: "kg", icon: Weight, color: "text-[#24AE7C]", bg: "bg-[#24AE7C]/10", normal: "Varies" },
  { label: "Oxygen Saturation", value: "—", unit: "%", icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10", normal: "95–100 %" },
];

export default function VitalsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-app-text">Vitals Tracker</h1>
        <p className="text-app-muted mt-1">Monitor your health metrics over time</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vitals.map(v => {
          const Icon = v.icon;
          return (
            <div key={v.label} className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${v.bg} flex items-center justify-center`}>
                  <Icon size={20} className={v.color} />
                </div>
                <span className="text-xs text-app-subtle bg-app-bg border border-app-border rounded-full px-3 py-1">
                  Normal: {v.normal}
                </span>
              </div>
              <div>
                <p className="text-3xl font-bold text-app-text">{v.value} <span className="text-sm text-app-subtle font-normal">{v.value !== "—" && v.unit}</span></p>
                <p className="text-sm text-app-muted mt-0.5">{v.label}</p>
              </div>
              <button className="w-full text-sm border border-app-border-2 hover:border-[#24AE7C]/40 text-app-subtle hover:text-app-text rounded-xl py-2 transition-colors cursor-pointer">
                + Log Reading
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-app-surface border border-app-border rounded-2xl p-6 text-center space-y-3">
        <Activity size={36} className="text-app-border-2 mx-auto" />
        <p className="text-base font-semibold text-app-text">Vitals Logging Coming Soon</p>
        <p className="text-sm text-app-subtle max-w-md mx-auto">
          Track your heart rate, blood pressure, glucose, and more over time with charts and trend analysis.
        </p>
      </div>
    </div>
  );
}
