import SchedulesRow from "@/components/scheduling-clusters/SchedulesRow";
import GlobalDiffSummary from "@/components/scheduling-clusters/GlobalDiffSummary";
import type { MachineSchedulePair, PreparedData } from "@/data/types";
import { useState } from "react";

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
        <div className="flex-1" />
      </header>

      <GlobalDiffSummary
        after={data.after}
        onlyMoved={onlyMoved}
        onToggleOnlyMoved={setOnlyMoved}
      />

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
