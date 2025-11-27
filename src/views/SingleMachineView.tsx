import ComparisonByMachine from "@/components/scheduling-clusters/ComparisonByMachine";
import { Button } from "@/components/ui/button";
import type { MachineSchedulePair } from "@/data/types";
import { getAppointmentsMovedCount } from "@/lib/utils/getAppointmentsMovedCount";
import { useMemo } from "react";

interface SingleMachineViewProps {
  pair: MachineSchedulePair;
  currentDate: Date | null;
  handleSeeAll: () => void;
}
const SingleMachineView: React.FC<SingleMachineViewProps> = ({
  currentDate,
  pair,
  handleSeeAll,
}) => {
  const movedCount = useMemo(
    () => getAppointmentsMovedCount(pair.after?.appointments ?? []),
    [pair]
  );
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-4">
      <header>
        <div className="flex items-baseline justify-between">
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
          <p className="text-xs text-slate-500 flex-1 text-right">
            {movedCount} appointments moved by the optimizer
          </p>
        </div>
        <Button size={"sm"} onClick={handleSeeAll}>
          Back to global view
        </Button>
      </header>

      {/* Vue principale : 1 colonne before, 1 colonne after */}
      <ComparisonByMachine {...pair} />
    </div>
  );
};

export default SingleMachineView;
