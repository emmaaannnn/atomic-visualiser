"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { testCaseOrderPayload, samplePresets } from "./data/testCase";
import type { OptimisationResult, PackingOrderPayload } from "./lib/types";
import { convertOrderPayloadToOptimisationResult } from "./lib/utils";

const Visualizer3D = dynamic(
  () => import("./components/Visualizer3D").then((m) => m.Visualizer3D),
  { ssr: false }
);

export default function VisualizerPage() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("test-case-1");
  const [livePayload, setLivePayload] = useState<PackingOrderPayload | null>(null);
  const [payloadSource, setPayloadSource] = useState<"example" | "live">("example");

  const currentPayload = useMemo(() => {
    if (payloadSource === "live" && livePayload) {
      return livePayload;
    }
    const preset = samplePresets.find((p) => p.id === selectedPresetId);
    return preset ? preset.payload : testCaseOrderPayload;
  }, [payloadSource, livePayload, selectedPresetId]);

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

      const payload = data.payload as PackingOrderPayload;
      const converted = convertOrderPayloadToOptimisationResult(payload);
      if (converted) {
        setLivePayload(payload);
        setPayloadSource("live");
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
      {/* Top Application Bar */}
      <header style={styles.topNavbar}>
        <div style={styles.navLeft}>
          <div style={styles.brandIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div>
            <div style={styles.brandTitle}>ATOMIC 3D VISUALISER</div>
            <div style={styles.brandSubtitle}>Industry-Standard Logistics & Packing Engine</div>
          </div>
        </div>

        <div style={styles.navRight}>
          {/* Order Ref Tag */}
          <div style={styles.orderBadge}>
            <span style={styles.orderLabel}>ORDER:</span>
            <span style={styles.orderVal}>{currentPayload.external_ref ?? currentPayload.orderId?.slice(0, 8)}</span>
          </div>

          {/* Preset Selector */}
          <div style={styles.presetGroup}>
            <span style={styles.presetLabel}>Scenario:</span>
            <select
              value={payloadSource === "live" ? "live" : selectedPresetId}
              onChange={(e) => {
                if (e.target.value === "live") {
                  setPayloadSource("live");
                } else {
                  setPayloadSource("example");
                  setSelectedPresetId(e.target.value);
                }
              }}
              style={styles.presetSelect}
            >
              {samplePresets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
              {livePayload && <option value="live">● Live Data (Parent Window)</option>}
            </select>
          </div>

          {/* Status Badge */}
          <div style={styles.statusBadge}>
            <span style={styles.statusDot} />
            <span>{currentPayload.status?.toUpperCase() ?? "SOLVED"}</span>
          </div>
        </div>
      </header>

      {/* 3D Visualizer Scene with Integrated Top Spec Card & Bottom Carousel Dock */}
      <div style={styles.sceneContainer}>
        <Visualizer3D
          key={payloadSource === "live" ? "live" : selectedPresetId}
          result={result}
        />
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    width: "100vw",
    height: "100dvh",
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(180deg, #0b1120 0%, #0f172a 50%, #020617 100%)",
    display: "flex",
    flexDirection: "column",
  },
  topNavbar: {
    height: 48,
    padding: "0 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(15, 23, 42, 0.95)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    zIndex: 40,
    flexShrink: 0,
    gap: 12,
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    background: "rgba(56, 189, 248, 0.15)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.06em",
    color: "#f8fafc",
    lineHeight: 1.1,
  },
  brandSubtitle: {
    fontSize: 10,
    color: "#94a3b8",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  orderBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    padding: "3px 8px",
    borderRadius: 6,
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  orderLabel: {
    color: "#94a3b8",
    fontWeight: 600,
  },
  orderVal: {
    color: "#38bdf8",
    fontWeight: 700,
  },
  presetGroup: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  presetLabel: {
    fontSize: 11,
    color: "#94a3b8",
  },
  presetSelect: {
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 6,
    background: "rgba(30, 41, 59, 0.9)",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    cursor: "pointer",
    outline: "none",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 10,
    fontWeight: 700,
    color: "#34d399",
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    padding: "3px 8px",
    borderRadius: 6,
    letterSpacing: "0.05em",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: "#10b981",
    boxShadow: "0 0 6px #10b981",
  },
  sceneContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
};
