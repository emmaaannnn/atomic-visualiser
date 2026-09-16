"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { testCaseOrderPayload } from "./data/testCase";
import type { OptimisationResult } from "./lib/types";
import { convertOrderPayloadToOptimisationResult } from "./lib/utils";

const Visualizer3D = dynamic(
  () => import("./components/Visualizer3D").then((m) => m.Visualizer3D),
  { ssr: false }
);

export default function VisualizerPage() {
  const [livePayload, setLivePayload] = useState<typeof testCaseOrderPayload | null>(null);
  const [payloadSource, setPayloadSource] = useState<"example" | "live">("example");
  const currentPayload = livePayload ?? testCaseOrderPayload;

  const result = useMemo<OptimisationResult | null>(() => {
    return convertOrderPayloadToOptimisationResult(currentPayload);
  }, [currentPayload]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const isLocalDev =
        event.origin.startsWith("http://localhost") || event.origin.startsWith("http://127.0.0.1");
      const isAllowedProductionOrigin = event.origin === "https://atomic-portal2026.vercel.app";

      if (!isLocalDev && !isAllowedProductionOrigin) return;

      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type !== "viz-data") return;

      console.log("visual-app received message", { origin: event.origin, data });

      const payload = data.payload as typeof testCaseOrderPayload;
      const converted = convertOrderPayloadToOptimisationResult(payload);
      if (converted) {
        console.log("visual-app converted payload to OptimisationResult", converted);
        setLivePayload(payload);
        setPayloadSource("live");
      } else {
        console.warn("visual-app could not convert payload", payload);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!result) {
    return <main style={styles.page} />;
  }

  return (
    <main style={styles.page}>
      <div style={styles.overlay}>
        <div>
          <div style={styles.kicker}>{payloadSource === "live" ? "Live data" : "TEST CASE"}</div>
          <div style={styles.title}>
            {payloadSource === "live" ? "Received visualiser payload" : (currentPayload.external_ref ?? "Order")}
          </div>
          <div style={styles.description}>
            {payloadSource === "live"
              ? "This scene is driven by data sent from the parent page."
              : "This scene uses the received order payload shape."}
          </div>
          <div style={styles.debugLine}>
            {currentPayload.status} · {currentPayload.packedContainers?.length ?? 0} packed container(s) · {currentPayload.items?.length ?? 0} item(s)
          </div>
          {payloadSource === "live" && <div style={styles.debugLine}>Listening for parent messages from localhost.</div>}
        </div>
      </div>

      <Visualizer3D result={result} />
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    width: "100vw",
    height: "100dvh",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
  },
  overlay: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    padding: "14px 16px",
    borderRadius: 18,
    background: "rgba(15, 23, 42, 0.84)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.22)",
    color: "#F8FAFC",
  },
  kicker: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "#93C5FD",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.2,
  },
  description: {
    fontSize: 13,
    lineHeight: 1.45,
    color: "#CBD5E1",
    marginTop: 4,
    maxWidth: 420,
  },
  debugLine: {
    marginTop: 8,
    fontSize: 12,
    color: "#7DD3FC",
  },
};
