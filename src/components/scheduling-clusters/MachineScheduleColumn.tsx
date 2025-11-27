import type { MachineSchedule, MachineSchedulePair } from "@/data/types";
import { cn } from "@/lib/utils";
import { getAppointmentsMovedCount } from "@/lib/utils/getAppointmentsMovedCount";
import { Button } from "../ui/button";
import { useEffect } from "react";
import MachineCalendar from "./MachineCalendar";

interface MachineScheduleColumnProps {
  pair: MachineSchedulePair;
  onDateResolved?: (date: Date) => void;
  showTimeLabels?: boolean;
  setActivePair: React.Dispatch<
    React.SetStateAction<MachineSchedulePair | null>
  >;
}

const MachineScheduleColumn: React.FC<MachineScheduleColumnProps> = ({
  pair,
  onDateResolved,
  showTimeLabels,
  setActivePair,
}) => {
  const { before, after, location } = pair;

  const handleSeeByMachine = () => {
    setActivePair(pair);
  };
  const movedCount = getAppointmentsMovedCount(after?.appointments ?? []);
  const prettyName =
    before?.resource?.pretty_name ?? after?.resource?.pretty_name ?? location;

  useEffect(() => {
    const ts =
      after?.appointments?.[0]?.scheduled_time ??
      before?.appointments?.[0]?.scheduled_time;
    if (!ts) return;
    const d = new Date(ts);
    if (isNaN(d.getTime())) return;
    onDateResolved?.(d);
  }, [after?.appointments, before?.appointments, onDateResolved]);

  return (
    <section
      className={cn(
        "flex flex-col gap-1",
        "rounded-lg border border-slate-200 bg-white p-1 shadow-sm"
      )}
    >
      <div className={cn("flex flex-col gap-1 items-center")}>
        <h2 className="text-sm font-semibold text-slate-800 text-center">
          {prettyName}
        </h2>
        <h3 className="text-xs font-semibold text-slate-500 text-center">
          ({movedCount} appointments moved by the optimizer)
        </h3>
        <Button size={"sm"} onClick={handleSeeByMachine}>
          See by machine
        </Button>
      </div>

      {before && (
        <div>
          <div className="mb-1 text-[11px] font-medium text-slate-500">
            Before
          </div>
          <MachineCalendar
            schedule={before}
            variant="before"
            showTimeLabels={!!showTimeLabels}
          />
        </div>
      )}

      {after && (
        <div>
          <div className="mb-1 text-[11px] font-medium text-slate-500">
            After
          </div>
          <MachineCalendar
            schedule={after}
            variant="after"
            showTimeLabels={!!showTimeLabels}
          />
        </div>
      )}
    </section>
  );
};

export default MachineScheduleColumn;
