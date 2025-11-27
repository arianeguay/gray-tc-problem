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

interface MachineScheduleColumnProps {
  pair: {
    location: string;
    before?: MachineSchedule;
    after?: MachineSchedule;
  };
}

const MachineScheduleColumn: React.FC<MachineScheduleColumnProps> = ({
  pair,
}) => {
  const { before, after, location } = pair;

  const prettyName =
    before?.resource?.pretty_name ??
    after?.resource?.pretty_name ??
    location;

  return (
    <section className={cn(
      "flex flex-col gap-2",
      "rounded-lg border border-slate-200 bg-white p-2 shadow-sm"
    )}>
      <h2 className="text-xs font-semibold text-slate-800 text-center">
        {prettyName}
      </h2>

      {before && (
        <div>
          <div className="mb-1 text-[11px] font-medium text-slate-500">
            Before
          </div>
          <MachineCalendar schedule={before} variant="before" />
        </div>
      )}

      {after && (
        <div>
          <div className="mb-1 text-[11px] font-medium text-slate-500">
            After
          </div>
          <MachineCalendar schedule={after} variant="after" />
        </div>
      )}
    </section>
  );
};

interface MachineCalendarProps {
  schedule: MachineSchedule;
  variant: "before" | "after";
}

const MachineCalendar: React.FC<MachineCalendarProps> = ({
  schedule,
  variant,
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
      },
    })
  );

  const eventClassNames: CalendarOptions["eventClassNames"] = (arg) => {
    const moved = Boolean(arg.event.extendedProps["moved"]);
    if (variant === "after" && moved) {
      return ["ring-2", "ring-amber-400", "ring-offset-1"];
    }
    return [];
  };

  const eventContent: CustomContentGenerator<EventContentArg> = (arg) => {
    const moved = Boolean(arg.event.extendedProps["moved"]);
    const color = (arg.event.extendedProps["clusterColor"] ||
      "#64748b") as string;

    return (
      <div
        className="flex h-full flex-col justify-between px-1 py-0.5 text-[10px] leading-tight text-white"
        style={{ backgroundColor: color }}
      >
        <div>
          <div className="font-semibold">{arg.timeText}</div>
          <div>{arg.event.title}</div>
        </div>
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
    initialDate: new Date(
      appointments[0]?.scheduled_time ?? "2023-08-07T07:00:00-04:00"
    ),
    events,
    weekends: false,
    slotMinTime: "07:00",
    slotMaxTime: "18:00",
    headerToolbar: false,
    allDaySlot: false,
    expandRows: true,
    height: "auto",
    eventClassNames,
    eventContent,
  };

  return (
    <div className={cn("min-h-[260px]")}>
      {/* cast pour calmer TS sur les options spécifiques */}
      <FullCalendar {...(options as any)} />
    </div>
  );
};

export default MachineScheduleColumn;
