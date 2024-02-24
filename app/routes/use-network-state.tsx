import { useState, useEffect } from "react";

declare global {
  interface Navigator {
    connection?: {
      downlink: number;
      downlinkMax: number;
      effectiveType: string;
      rtt: number;
      saveData: boolean;
      type: string;
      addEventListener(
        type: "change",
        listener: (this: this, ev: Event) => any,
        options?: boolean | AddEventListenerOptions
      ): void;
      removeEventListener(
        type: "change",
        listener: (this: this, ev: Event) => any,
        options?: boolean | EventListenerOptions
      ): void;
    };
  }
}

type NetworkState = {
  online: boolean;
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
  type?: string;
};

function useNetworkState() {
  const [networkState, setNetworkState] = useState<NetworkState>({
    online: false,
  });

  useEffect(() => {
    const updateNetworkState = () => {
      setNetworkState({
        online: navigator.onLine,
        downlink: navigator.connection?.downlink,
        downlinkMax: navigator.connection?.downlinkMax,
        effectiveType: navigator.connection?.effectiveType,
        rtt: navigator.connection?.rtt,
        saveData: navigator.connection?.saveData,
        type: navigator.connection?.type,
      });
    };

    // Call the function once to get the initial state
    updateNetworkState();

    window.addEventListener("online", updateNetworkState);
    window.addEventListener("offline", updateNetworkState);
    navigator.connection?.addEventListener("change", updateNetworkState);

    return () => {
      window.removeEventListener("online", updateNetworkState);
      window.removeEventListener("offline", updateNetworkState);
      navigator.connection?.removeEventListener("change", updateNetworkState);
    };
  }, []);

  return networkState;
}

export default function UseNetworkStateRoute() {
  const network = useNetworkState();

  return (
    <section className="p-4">
      <h1 className="text-lg font-semibold">Network State</h1>
      <div className="mt-4 overflow-x-auto">
        <table className="table-auto w-full">
          <tbody>
            {Object.keys(network).map((key) => {
              return (
                <tr key={key}>
                  <th className="px-4 py-2 text-left">{key}</th>
                  <td className="border px-4 py-2">{`${
                    network[key as keyof typeof network]
                  }`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
