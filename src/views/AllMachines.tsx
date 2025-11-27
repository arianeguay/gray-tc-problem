import SchedulesRow from "@/components/scheduling-clusters/SchedulesRow";
import type { PreparedData } from "@/data/types";

interface AllMachinesViewProps {
  data: PreparedData;
  currentDate: Date;
}
const AllMachinesView: React.FC<AllMachinesViewProps> = ({
  data,
  currentDate,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-4">
      <header className="flex items-baseline justify-between">
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
      </header>

      {/* Vue principale : 1 colonne par machine, Before/After empilés */}
      <SchedulesRow
        before={data.before}
        after={data.after}
        onDateResolved={setCurrentDate}
      />
    </div>
  );
};

export default AllMachinesView;
