import { useRef, useState } from "react";

interface RenderInfo {
  readonly module: string;
  renders: number;
  timestamp: null | number;
  sinceLast: null | number | "[now]";
}

const useRenderInfo = (
  moduleName: string = "Unknown component",
  log: boolean = true
) => {
  const { current: info } = useRef<RenderInfo>({
    module: moduleName,
    renders: 0,
    timestamp: null,
    sinceLast: null,
  });

  const now = Date.now();

  info.renders += 1;
  info.sinceLast = info.timestamp ? (now - info.timestamp) / 1000 : "[now]";
  info.timestamp = now;

  if (log) {
    console.group(`${moduleName} info`);
    console.log(
      `Render no: ${info.renders}${
        info.renders > 1 ? `, ${info.sinceLast}s since last render` : ""
      }`
    );
    console.dir(info);
    console.groupEnd();
  }

  return info;
};

export default function UseRenderInfoRoute() {
  const [count, setCount] = useState(0);
  const renderInfo = useRenderInfo("UseRenderInfoRoute");

  return (
    <section className="p-4">
      <h1 className="text-xl font-bold">useRenderInfo</h1>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
        onClick={() => setCount(count + 1)}
      >
        Re-Render
      </button>
      <div className="mt-4">
        <p>Module: {renderInfo.module}</p>
        <p>Renders: {renderInfo.renders}</p>
        <p>Timestamp: {renderInfo.timestamp}</p>
        <p>Since Last Render: {renderInfo.sinceLast}s</p>
      </div>
    </section>
  );
}
