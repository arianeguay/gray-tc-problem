import React from "react";

const Swatch: React.FC<{ color: string; label: string; borderLeft?: string }> = ({
  color,
  label,
  borderLeft,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-4 w-6 rounded-[3px]"
        style={{ backgroundColor: color, borderLeft: borderLeft ?? "3px solid rgba(15,23,42,0.25)" }}
      />
      <span className="text-[11px] text-slate-600">{label}</span>
    </div>
  );
};

const Legend: React.FC = () => {
  return (
    <div className="mb-2 rounded-md border border-slate-200 bg-white p-2">
      <div className="mb-1 text-[11px] font-medium text-slate-700">Legend</div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Swatch color="#64748b" label="Cluster color (varies by cluster)" />
        <Swatch
          color="#64748b"
          borderLeft="3px solid rgba(250, 91, 63, 0.95)"
          label="Moved (after optimization)"
        />
        <div className="col-span-2 text-[11px] text-slate-500">
          Colors represent technique clusters. A white left accent marks appointments moved by the optimizer (only visible in the After view).
        </div>
      </div>
    </div>
  );
};

export default Legend;
