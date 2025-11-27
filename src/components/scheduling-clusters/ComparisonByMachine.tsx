import type { MachineSchedulePair } from "@/data/types";
import { cn } from "@/lib/utils";
import MachineCalendar from "./MachineCalendar";

const ComparisonByMachine: React.FC<MachineSchedulePair> = ({
  after,
  before,
}) => {
  if (!before && !after) {
    return "Comparison Impossible. Please reload the page";
  }
  return (
    <div className={cn("grid gap-2", "xl:grid-cols-2")}>
      {!!before && (
        <div>
          <div className="mb-1 text-[11px] font-medium text-slate-500">Before</div>
          <MachineCalendar
            schedule={before}
            variant="before"
            showTimeLabels={true}
          />
        </div>
      )}
      {!!after && (
        <div>
          <div className="mb-1 text-[11px] font-medium text-slate-500">After</div>
          <MachineCalendar
            schedule={after}
            variant="after"
            showTimeLabels={!before}
          />
        </div>
      )}
    </div>
  );
};

export default ComparisonByMachine;
