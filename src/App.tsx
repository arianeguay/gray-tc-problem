import { useEffect, useState } from "react";
import { prepareData } from "./lib/prepareData";
import { cn } from "./lib/utils";
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

  if(!data) return null;
  return (
    <div
      className={cn("flex min-h-screen flex-col items-center justify-center")}
    >
      <h1 className={cn("text-xl")}>Hello World!</h1>
    </div>
  );
}

export default App;
