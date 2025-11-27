import type { MachineSchedule, MachineSchedulePair } from "@/data/types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import MachineScheduleColumn from "./MachineScheduleColumn";

interface SchedulesRowProps {
  before: MachineSchedule[];
  after: MachineSchedule[];
  onDateResolved?: (date: Date) => void;
  setActivePair: React.Dispatch<
    React.SetStateAction<MachineSchedulePair | null>
  >;
}

type MachinePair = {
  location: string;
  before?: MachineSchedule;
  after?: MachineSchedule;
};

const SchedulesRow: React.FC<SchedulesRowProps> = ({
  before,
  after,
  onDateResolved,
  setActivePair,
}) => {
  const machinePairs = useMemo<MachinePair[]>(() => {
    const map = new Map<string, MachinePair>();

    const ensurePair = (location: string): MachinePair => {
      let pair = map.get(location);
      if (!pair) {
        pair = { location };
        map.set(location, pair);
      }
      return pair;
    };

    for (const sched of before) {
      const pair = ensurePair(sched.location);
      pair.before = sched;
    }

    for (const sched of after) {
      const pair = ensurePair(sched.location);
      pair.after = sched;
    }

    const pairs = Array.from(map.values());
    pairs.sort((a, b) => {
      const aName =
        a.before?.resource?.pretty_name ??
        a.after?.resource?.pretty_name ??
        a.location;
      const bName =
        b.before?.resource?.pretty_name ??
        b.after?.resource?.pretty_name ??
        b.location;
      return aName.localeCompare(bName);
    });

    return pairs;
  }, [before, after]);

  return (
    <div className={cn("grid gap-2", "md:grid-cols-2", "xl:grid-cols-5")}>
      {machinePairs.map((pair, idx) => (
        <MachineScheduleColumn
          key={pair.location}
          pair={pair}
          onDateResolved={onDateResolved}
          showTimeLabels={idx === 0}
          setActivePair={setActivePair}
        />
      ))}
    </div>
  );
};

export type { MachinePair };
export default SchedulesRow;
