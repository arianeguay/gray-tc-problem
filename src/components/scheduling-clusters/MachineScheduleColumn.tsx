import type { MachineSchedule } from "@/data/types";
import type {
  CalendarOptions,
  CustomContentGenerator,
  EventContentArg,
  EventInput,
  EventSourceInput,
} from "@fullcalendar/core/index.js";
import { computeEnd } from "@/utils/time";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { cn } from "@/lib/utils";

interface MachineScheduleColumnProps {
  schedule: MachineSchedule;
  activeDate: Date;
  variant: "before" | "after";
}

const MachineScheduleColumn: React.FC<MachineScheduleColumnProps> = ({
  schedule,
  activeDate,
  variant,
}) => {
  const { appointments, resource, location } = schedule;

  const events: EventSourceInput = appointments.map(
    (appt): EventInput =>
      ({
        id: appt.id,
        start: appt.scheduled_time,
        end: computeEnd(appt),
        title: appt.technique_label,
        extendedProps: {
          cluster: appt.clusterMeta,
          moved: appt.isMoved,
          modified: appt.isModified,
        },
        overlap: appt.overlap_allowed,
        backgroundColor: appt.clusterMeta?.color,
      } as EventInput)
  );

  const eventClassNames: CalendarOptions["eventClassNames"] = (arg) => {
    const moved = arg.event.extendedProps["moved"];
    if (variant === "after" && moved) {
      return ["ring-2", "ring-offset-1", "ring-amber-400"];
    }
    return [];
  };

  const eventContent: CustomContentGenerator<EventContentArg> = (arg) => {
    const moved = arg.event.extendedProps["moved"];
    return (
      <div className="flex flex-col text-[10px] leading-tight">
        <span className="font-semibold">
          {arg.timeText} – {arg.event.title}
        </span>
        {variant === "after" && moved && (
          <span className="mt-0.5 inline-flex w-fit rounded-full bg-amber-100 px-1 text-[9px] font-semibold text-amber-700">
            moved
          </span>
        )}
      </div>
    );
  };

  const options: CalendarOptions = {
    plugins: [timeGridPlugin],
    initialView: "timeGridDay",
    events,
    weekends: false,
    initialDate: activeDate,
    slotMinTime: "07:00",
    slotMaxTime: "18:00",
    headerToolbar: false,
    allDaySlot: false,
    eventClassNames,
    eventContent,
  };

  return (
    <div className={cn("flex-1 min-h-screen")}>
      <div className="mb-1 text-xs font-medium text-slate-700">
        {resource?.pretty_name ?? location}
      </div>
      <FullCalendar {...options} />
    </div>
  );
};

export default MachineScheduleColumn;
