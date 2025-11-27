import type { MachineSchedule } from "@/data/types";
import { getAppointmentsMovedCount } from "@/lib/utils/getAppointmentsMovedCount";
import React, { useMemo } from "react";

interface GlobalDiffSummaryProps {
  after: MachineSchedule[];
  onlyMoved: boolean;
  onToggleOnlyMoved: (v: boolean) => void;
}

const GlobalDiffSummary: React.FC<GlobalDiffSummaryProps> = ({ after, onlyMoved, onToggleOnlyMoved }) => {
  const { perMachine, total } = useMemo(() => {
    const per = after.map((sched) => {
      const name = sched.resource?.pretty_name ?? sched.location;
      const count = getAppointmentsMovedCount(sched.appointments);
      return { name, count };
    });
    per.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    const tot = per.reduce((acc, it) => acc + it.count, 0);
    return { perMachine: per, total: tot };
  }, [after]);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-[11px] font-medium text-slate-700">Global diff summary</div>
        <div className="flex items-center gap-3">
          <div className="text-[12px] font-semibold text-slate-900">Total moved today: {total}</div>
          <label className="inline-flex items-center gap-2 text-[11px] text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 accent-slate-700"
              checked={onlyMoved}
              onChange={(e) => onToggleOnlyMoved(e.target.checked)}
            />
            Show only moved
          </label>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {perMachine.map(({ name, count }) => (
          <span
            key={name}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700"
            aria-label={`${count} appointments moved on ${name}`}
          >
            <span className="font-semibold text-slate-900">{count}</span>
            <span className="text-slate-600">appointments moved on</span>
            <span className="font-medium">{name}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default GlobalDiffSummary;
