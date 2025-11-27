import SchedulesRow from "@/components/scheduling-clusters/SchedulesRow";
import type { MachineSchedulePair, PreparedData } from "@/data/types";
import { getAppointmentsMovedCount } from "@/lib/utils/getAppointmentsMovedCount";
import { useMemo, useState } from "react";

interface AllMachinesViewProps {
  data: PreparedData;
  currentDate: Date | null;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setActivePair: React.Dispatch<
    React.SetStateAction<MachineSchedulePair | null>
  >;
}
const AllMachinesView: React.FC<AllMachinesViewProps> = ({
  data,
  currentDate,
  setCurrentDate,
  setActivePair
}) => {
  const movedCount = useMemo(
    () => getAppointmentsMovedCount(data.after.flatMap((s) => s.appointments)),
    [data]
  );
  const [onlyMoved, setOnlyMoved] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-4">
      <header className="flex items-baseline justify-between gap-4">
        <h1 className="text-md font-medium text-slate-800 flex-1">
          Technique clustering — daily schedule
        </h1>
        {currentDate && (
          <h2 className="flex-1 text-center text-xl font-semibold text-slate-900">
            {currentDate.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </h2>
        )}
        <div className="flex-1 flex items-center justify-end gap-4">
          <label className="inline-flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 accent-slate-700"
              checked={onlyMoved}
              onChange={(e) => setOnlyMoved(e.target.checked)}
            />
            Show only moved
          </label>
          <p className="text-xs text-slate-500">
            {movedCount} appointments moved by the optimizer
          </p>
        </div>
      </header>

      {/* Vue principale : 1 colonne par machine, Before/After empilés */}
      <SchedulesRow
        before={data.before}
        after={data.after}
        onDateResolved={setCurrentDate}
        setActivePair={setActivePair}
        onlyMoved={onlyMoved}
      />
    </div>
  );
};

export default AllMachinesView;
