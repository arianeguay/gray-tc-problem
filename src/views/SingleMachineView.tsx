import ComparisonByMachine from "@/components/scheduling-clusters/ComparisonByMachine";
import { Button } from "@/components/ui/button";
import type { MachineSchedulePair } from "@/data/types";

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
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-4">
      <header>
        <div className="flex items-baseline justify-between gap-4">
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
