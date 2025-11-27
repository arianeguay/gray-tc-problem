import type { MachineSchedule } from "@/data/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import MachineScheduleColumn from "./MachineScheduleColumn";

interface SchedulesRowProps {
  schedules: MachineSchedule[];
  variant: "before" | "after";
}

const SchedulesRow: React.FC<SchedulesRowProps> = ({ schedules, variant }) => {
  const [activeDate] = useState(new Date("2023-08-07"));

  return (
    <div className={cn("flex flex-row w-full min-h-screen gap-4")}>
      {schedules.map((s) => (
        <MachineScheduleColumn
          key={s.location}
          schedule={s}
          activeDate={activeDate}
          variant={variant}
        />
      ))}
    </div>
  );
};

export default SchedulesRow;
