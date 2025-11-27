import { useEffect, useState } from "react";
import SchedulesRow from "./components/scheduling-clusters/SchedulesRow";
import { prepareData } from "./lib/prepareData";
import type { PreparedData } from "./data/types";

function App() {
  const [data, setData] = useState<PreparedData | null>(null);

  useEffect(() => {
    const setupData = async () => {
      const data = await prepareData();
      setData(data);
    };

    setupData();
  }, []);

  if (!data) return null;

  const movedCount = data.after
    .flatMap((s) => s.appointments)
    .filter((a) => a.isMoved).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-4">
      <header className="flex items-baseline justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Technique clustering – daily schedule
        </h1>
        <p className="text-xs text-slate-500">
          {movedCount} appointments moved by the optimizer
        </p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-700">
            Before optimization
          </h2>
          <SchedulesRow schedules={data.before} variant="before" />
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-700">
            After optimization
          </h2>
          <SchedulesRow schedules={data.after} variant="after" />
        </section>
      </div>
    </div>
  );
}

export default App