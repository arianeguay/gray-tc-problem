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
  useEffect(() => {
    const setupData = async () => {
      const prepared = await prepareData();
      setData(prepared);
    };

    setupData();
  }, []);

  const handleSeeAll = () => setActivePair(null);

  if (!data) return null;

  return activePair ? (
    <SingleMachineView
      pair={activePair}
      currentDate={currentDate}
      handleSeeAll={handleSeeAll}
    />
  ) : (
    <AllMachinesView
      data={data}
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      setActivePair={setActivePair}
    />
  );
}

export default App;
