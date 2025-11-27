import { cn } from "@/lib/utils";
import type { MachineSchedulePair } from "./MachineScheduleColumn";


const ComparisonByMachine :React.FC<MachineSchedulePair>= ({location}) => {
  return (
    <div className={cn("grid gap-2", "xl:grid-cols-2")}>
      Comparison by Machine
    </div>
  );
};

export default ComparisonByMachine;
