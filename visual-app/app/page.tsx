"use client";

import dynamic from "next/dynamic";
import { useState, type CSSProperties } from "react";
import { mockCaseOrder, mockCases, type MockCaseId } from "./data/mockData";

const Visualizer3D = dynamic(
  () => import("./components/Visualizer3D").then((m) => m.Visualizer3D),
  { ssr: false }
);

export default function VisualizerPage() {
  const [activeCase, setActiveCase] = useState<MockCaseId>("case1");
  const activeScenario = mockCases[activeCase];

  return (
    <main style={styles.page}>
      <div style={styles.overlay}>
        <div>
          <div style={styles.kicker}>Mock data</div>
          <div style={styles.title}>{activeScenario.label}</div>
          <div style={styles.description}>{activeScenario.description}</div>
        </div>

        <div style={styles.caseSwitcher}>
          {mockCaseOrder.map((caseId) => {
            const scenario = mockCases[caseId];
            const isActive = caseId === activeCase;

            return (
              <button
                key={caseId}
                type="button"
                onClick={() => setActiveCase(caseId)}
                style={{
                  ...styles.caseButton,
                  ...(isActive ? styles.caseButtonActive : {}),
                }}
              >
                <span style={styles.caseButtonLabel}>{scenario.label}</span>
                <span style={styles.caseButtonMeta}>
                  {scenario.output.placements.length} placements
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Visualizer3D result={activeScenario.output} />
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
  caseSwitcher: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  caseButton: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(148, 163, 184, 0.28)",
    background: "rgba(255, 255, 255, 0.08)",
    color: "#E2E8F0",
    borderRadius: 14,
    padding: "10px 14px",
    minWidth: 132,
    textAlign: "left",
    cursor: "pointer",
    transition: "transform 120ms ease, background 120ms ease, border-color 120ms ease",
  },
  caseButtonActive: {
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(14, 165, 233, 0.95))",
    borderColor: "rgba(125, 211, 252, 0.95)",
    color: "#FFFFFF",
    transform: "translateY(-1px)",
  },
  caseButtonLabel: {
    display: "block",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.2,
  },
  caseButtonMeta: {
    display: "block",
    marginTop: 4,
    fontSize: 12,
    opacity: 0.82,
  },
};
