import type { MachineSchedule } from "@/data/types";
import type {
  CalendarOptions,
  CustomContentGenerator,
  EventContentArg,
  EventInput,
  EventSourceInput,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { cn, computeEnd } from "@/lib/utils";

interface MachineCalendarProps {
  schedule: MachineSchedule;
  variant: "before" | "after";
  showTimeLabels?: boolean;
}

const eventContent: CustomContentGenerator<EventContentArg> = (arg) => {
  const color = (arg.event.extendedProps["clusterColor"] ||
    "#64748b") as string;

  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between px-1 py-0.5 text-[10px] leading-tight text-white"
      )}
      style={{
        backgroundColor: color,
      }}
    >
      <div>
        <div className="title">{arg.event.title}</div>
        <div className="caption">{arg.timeText}</div>
        <div className="caption">{arg.event.extendedProps.duration} mins</div>
      </div>
    </div>
  );
};

const MachineCalendar: React.FC<MachineCalendarProps> = ({
  schedule,
  variant,
  showTimeLabels,
}) => {
  const { appointments } = schedule;

  const events: EventSourceInput = appointments.map(
    (appt): EventInput => ({
      id: appt.id,
      start: appt.scheduled_time,
      end: computeEnd(appt),
      title: appt.techniqueLabel,
      extendedProps: {
        clusterColor: appt.clusterMeta?.color,
        moved: appt.isMoved,
        modified: appt.isModified,
        duration: appt.duration,
      },
    })
  );

  const eventClassNames: CalendarOptions["eventClassNames"] = (arg) => {
    const moved = Boolean(arg.event.extendedProps["moved"]);
    if (variant === "after" && moved) {
      return [
        "border-2",
        "border-red-600",
        "ring-2",
        "ring-red-300",
        "ring-offset-1",
        "ring-offset-white",
      ];
    }
    return [];
  };

  const slotLaneClassNames: CalendarOptions["slotLaneClassNames"] = (arg) => {
    return ["slot-lane"];
  };

  const options: CalendarOptions = {
    plugins: [timeGridPlugin],
    initialView: "timeGridDay",
    initialDate: new Date(
      appointments[0]?.scheduled_time ?? "2023-08-07T07:00:00-04:00"
    ),
    events,
    weekends: false,
    slotDuration: "00:30",
    slotMinTime: "07:00",
    slotMaxTime: "18:00",
    headerToolbar: false,
    dayHeaders: false,
    allDaySlot: false,
    expandRows: true,
    height: "auto",
    slotLaneClassNames,
    eventClassNames,
    eventContent,
    slotLabelContent: showTimeLabels ? undefined : () => "",
  };

  return (
    <div
      className={cn("min-h-[260px]", !showTimeLabels && "fc-hide-time-axis")}
    >
      {/* cast pour calmer TS sur les options spécifiques */}
      <FullCalendar {...(options as any)} />
    </div>
  );
};

export default MachineCalendar;
