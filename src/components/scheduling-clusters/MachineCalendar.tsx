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
import { OctagonAlert } from "lucide-react";

function textColorForBackground(bg: string): string {
  const hex = bg.trim();
  const match = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(hex);
  if (!match) return "#ffffff";
  let r = 0, g = 0, b = 0;
  const h = match[1];
  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
  } else {
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
  }
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 186 ? "#111827" : "#ffffff";
}

interface MachineCalendarProps {
  schedule: MachineSchedule;
  variant: "before" | "after";
  showTimeLabels?: boolean;
  onlyMoved?: boolean;
}

const eventContent: CustomContentGenerator<EventContentArg> = (arg) => {
  const moved = Boolean(arg.event.extendedProps["moved"]);
  const color = (arg.event.extendedProps["clusterColor"] ||
    "#64748b") as string;

  const isAfter = Boolean(arg.event.extendedProps["isAfter"]);
  const isHighlighted = moved && isAfter;

  const borderColor = isHighlighted
    ? "rgba(250, 91, 63, 0.95)"
    : "rgba(15,23,42,0.25)";
  const fg = textColorForBackground(color);
  return (
    <div
      className="flex h-full flex-col justify-between px-1 py-0.5 text-[10px] leading-tight text-white rounded-[3px]"
      style={{
        backgroundColor: color,
        // white accent highlight (after + moved)
        border: `3px solid ${borderColor}`,
        borderLeft: `6px solid ${borderColor}`,
        outline: isHighlighted ? "1px solid rgba(255,255,255,0.6)" : "none",
        outlineOffset: 0,
        color: fg,
      }}
    >
      <div>
        <div className="title">{arg.event.title}</div>
        <div className="caption">{arg.timeText}</div>
        <div className="caption">{arg.event.extendedProps.duration} mins</div>
      </div>
      {isHighlighted && (
        <OctagonAlert
          size={20}
          style={{ position: "absolute", top: 8, right: 8 }}
        />
      )}
    </div>
  );
}

const MachineCalendar: React.FC<MachineCalendarProps> = ({
  schedule,
  variant,
  showTimeLabels,
  onlyMoved,
}) => {
  const { appointments } = schedule;

  const events: EventSourceInput = appointments
    .filter((appt) => (!onlyMoved ? true : Boolean(appt.isMoved)))
    .map(
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
        isAfter: variant === "after",
      },
    })
  );

  const eventClassNames: CalendarOptions["eventClassNames"] = (arg) => {
    const moved = Boolean(arg.event.extendedProps["moved"]);
    const isAfter = Boolean(arg.event.extendedProps["isAfter"]);
    if (isAfter && moved) {
      return ["ring-1", "ring-white", "ring-offset-0"]; // subtle white ring
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
