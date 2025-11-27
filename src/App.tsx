import { useEffect, useState } from "react";
import { prepareData } from "./lib/prepareData";
import type { MachineSchedulePair, PreparedData } from "./data/types";
import AllMachinesView from "./views/AllMachines";
import SingleMachineView from "./views/SingleMachineView";

function App() {
  const [data, setData] = useState<PreparedData | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [activePair, setActivePair] = useState<MachineSchedulePair | null>(
    null
  );
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  useEffect(() => {
    const setupData = async () => {
      try {
        setStatus("loading");
        const prepared = await prepareData();
        setData(prepared);
        setStatus("ready");
      } catch (e) {
        console.error("Failed to prepare data", e);
        setStatus("error");
      }
    };

    setupData();
  }, []);

  const handleSeeAll = () => setActivePair(null);

  if (status === "loading" || (!data && status !== "error")) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center text-slate-700">
        Loading daily schedule…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center text-slate-700">
        An error occurred while loading data. Please refresh the page.
      </div>
    );
  }

  return activePair ? (
    <SingleMachineView
      pair={activePair}
      currentDate={currentDate}
      handleSeeAll={handleSeeAll}
    />
  ) : (
    <AllMachinesView
      data={data!}
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      setActivePair={setActivePair}
    />
  );
}

export default App;
