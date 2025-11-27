import { useEffect, useState } from "react";
import { prepareData } from "./lib/prepareData";
import type { PreparedData } from "./data/types";
import SchedulesRow from "./components/scheduling-clusters/SchedulesRow";

function App() {
  const [data, setData] = useState<PreparedData | null>(null);

  useEffect(() => {
    const setupData = async () => {
      const prepared = await prepareData();
      setData(prepared);
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
          Technique clustering — daily schedule
        </h1>
        <p className="text-xs text-slate-500">
          {movedCount} appointments moved by the optimizer
        </p>
 
      </header>

      {/* Vue principale : 1 colonne par machine, Before/After empilés */}
      <SchedulesRow before={data.before} after={data.after} />
    </div>
  );
}

export default App;
