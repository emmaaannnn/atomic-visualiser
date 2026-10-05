"use client";

import { useState } from "react";
import type { UsedBox, Placement } from "../lib/types";
import {
  calculateBoxVolumeCm3,
  formatDimensions,
  formatVolume,
} from "../lib/utils";

interface BoxSpecificationCardProps {
  usedBox?: UsedBox;
  availableBoxes: UsedBox[];
  activeInstance: number;
  onSelectInstance: (instanceId: number) => void;
  currentPlacements: Placement[];
  currentStep: number;
}

export function BoxSpecificationCard({
  usedBox,
  availableBoxes,
  activeInstance,
  onSelectInstance,
  currentPlacements,
  currentStep,
}: BoxSpecificationCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!usedBox) {
    return null;
  }

  // Format dimensions
  const dims = formatDimensions(usedBox.dimension);
  const totalVolumeCm3 = calculateBoxVolumeCm3(usedBox.dimension);
  const formattedTotalVolume = formatVolume(totalVolumeCm3);

  // Dynamic values based on current step
  const packedItems = currentPlacements.slice(0, currentStep);
  const currentWeight = packedItems.reduce((acc, p) => acc + (p.weight ?? 0), 0);
  const maxWeight = usedBox.maxWeight ?? 40;
  const weightUnit = usedBox.weightUnit ?? "kg";
  const weightPercent = Math.min(100, Math.round((currentWeight / maxWeight) * 100));
  const remainingWeight = Math.max(0, maxWeight - currentWeight);

  // Packed volume calculation
  const currentPackedVolumeCm3 = packedItems.reduce((acc, p) => {
    return (
      acc +
      (p.placedDimension.width / 10) *
        (p.placedDimension.length / 10) *
        (p.placedDimension.depth / 10)
    );
  }, 0);
  const utilizationPercent =
    totalVolumeCm3 > 0
      ? Math.min(100, (currentPackedVolumeCm3 / totalVolumeCm3) * 100)
      : (usedBox.utilisation ?? 0) * 100;

  return (
    <div style={styles.cardContainer}>
      {/* Top Header Row */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.boxIconBadge}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <div style={styles.kicker}>CONTAINER SPECIFICATION</div>
            <div style={styles.titleRow}>
              <h2 style={styles.boxTitle}>
                {usedBox.boxReference}{" "}
                <span style={styles.instanceTag}>Instance #{usedBox.boxInstance}</span>
              </h2>
              <span style={styles.typeBadge}>
                {usedBox.containerType ?? "FEFCO 0201 Standard"}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.headerRight}>
          {/* Multi-box tabs if more than 1 box */}
          {availableBoxes.length > 1 && (
            <div style={styles.cartonTabs}>
              {availableBoxes.map((b) => (
                <button
                  key={b.boxInstance}
                  onClick={() => onSelectInstance(b.boxInstance)}
                  style={{
                    ...styles.cartonTabButton,
                    ...(b.boxInstance === activeInstance ? styles.cartonTabActive : {}),
                  }}
                >
                  Carton {b.boxInstance}
                </button>
              ))}
            </div>
          )}

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={styles.toggleButton}
            title={isCollapsed ? "Expand specifications" : "Collapse specifications"}
            aria-label={isCollapsed ? "Expand specifications" : "Collapse specifications"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isCollapsed ? "rotate(-90deg)" : "rotate(90deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span style={styles.toggleText}>{isCollapsed ? "Expand Specs" : "Minimize"}</span>
          </button>
        </div>
      </div>

      {/* Main Spec Content (Collapsible) */}
      {!isCollapsed ? (
        <div style={styles.body}>
          {/* Grid of 4 Key Specification Cards */}
          <div style={styles.metricsGrid}>
            {/* Metric 1: Dimensions */}
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                >
                  <path d="M21 3H3v18h18V3z" />
                  <path d="M7 3v4" />
                  <path d="M12 3v2" />
                  <path d="M17 3v4" />
                </svg>
                <span style={styles.metricLabel}>Measurements (L × W × H)</span>
              </div>
              <div style={styles.metricValueLarge}>{dims.summaryCm}</div>
              <div style={styles.metricSubtext}>
                Internal: {dims.summaryMm}
              </div>
            </div>

            {/* Metric 2: Gross & Usable Volume */}
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <span style={styles.metricLabel}>Total Capacity Volume</span>
              </div>
              <div style={styles.metricValueLarge}>
                {formattedTotalVolume.liters} <span style={styles.unitText}>Liters</span>
              </div>
              <div style={styles.metricSubtext}>
                Gross: {formattedTotalVolume.m3} m³ ({Math.round(totalVolumeCm3).toLocaleString()} cm³)
              </div>
            </div>

            {/* Metric 3: Weight Load & Limits */}
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <span style={styles.metricLabel}>Weight & Capacity</span>
              </div>
              <div style={styles.metricValueLarge}>
                {currentWeight.toFixed(1)}{" "}
                <span style={styles.unitText}>/ {maxWeight} {weightUnit}</span>
              </div>
              <div style={styles.metricSubtext}>
                {remainingWeight.toFixed(1)} {weightUnit} safe margin remaining ({weightPercent}% used)
              </div>
            </div>

            {/* Metric 4: Volumetric Utilization Gauge */}
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span style={styles.metricLabel}>Volumetric Utilization</span>
                <span style={styles.utilizationPercentText}>
                  {utilizationPercent.toFixed(1)}%
                </span>
              </div>
              {/* Progress Gauge */}
              <div style={styles.gaugeTrack}>
                <div
                  style={{
                    ...styles.gaugeFill,
                    width: `${Math.min(100, Math.max(0, utilizationPercent))}%`,
                  }}
                />
              </div>
              <div style={styles.metricSubtext}>
                {packedItems.length} of {currentPlacements.length} items packed in this carton
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Compact Summary Bar when collapsed */
        <div style={styles.compactBar}>
          <span style={styles.compactItem}>
            <strong>Dims:</strong> {dims.summaryCm}
          </span>
          <span style={styles.compactDivider}>•</span>
          <span style={styles.compactItem}>
            <strong>Volume:</strong> {formattedTotalVolume.liters} L
          </span>
          <span style={styles.compactDivider}>•</span>
          <span style={styles.compactItem}>
            <strong>Weight:</strong> {currentWeight.toFixed(1)} / {maxWeight} {weightUnit}
          </span>
          <span style={styles.compactDivider}>•</span>
          <span style={styles.compactItem}>
            <strong>Fill:</strong>{" "}
            <span style={{ color: "#38bdf8", fontWeight: 700 }}>
              {utilizationPercent.toFixed(1)}%
            </span>
          </span>
          <span style={styles.compactDivider}>•</span>
          <span style={styles.compactItem}>
            <strong>Packed:</strong> {packedItems.length}/{currentPlacements.length}
          </span>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  cardContainer: {
    position: "absolute",
    top: 14,
    left: 16,
    right: 16,
    zIndex: 40,
    background: "rgba(15, 23, 42, 0.88)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.4), 0 0 1px rgba(255, 255, 255, 0.2)",
    color: "#f8fafc",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif",
    transition: "all 0.25s ease",
    pointerEvents: "auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 18px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    gap: 12,
    flexWrap: "wrap",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  boxIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "rgba(56, 189, 248, 0.15)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  kicker: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#38bdf8",
    textTransform: "uppercase",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
    flexWrap: "wrap",
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
    lineHeight: 1.2,
  },
  instanceTag: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: 500,
  },
  typeBadge: {
    fontSize: 11,
    fontWeight: 600,
    color: "#cbd5e1",
    background: "rgba(255, 255, 255, 0.08)",
    padding: "2px 8px",
    borderRadius: 6,
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  cartonTabs: {
    display: "flex",
    gap: 4,
    background: "rgba(0, 0, 0, 0.3)",
    padding: 3,
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  cartonTabButton: {
    fontSize: 12,
    fontWeight: 600,
    padding: "5px 12px",
    borderRadius: 6,
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  cartonTabActive: {
    background: "#2563eb",
    color: "#ffffff",
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
  },
  toggleButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#cbd5e1",
    background: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: "6px 12px",
    cursor: "pointer",
    transition: "background 0.15s ease",
  },
  toggleText: {
    fontSize: 12,
  },
  body: {
    padding: "14px 18px",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 12,
  },
  metricCard: {
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: 10,
    padding: "10px 14px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  metricHeader: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    flex: 1,
  },
  utilizationPercentText: {
    fontSize: 13,
    fontWeight: 700,
    color: "#38bdf8",
  },
  metricValueLarge: {
    fontSize: 16,
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "-0.01em",
  },
  unitText: {
    fontSize: 12,
    fontWeight: 500,
    color: "#94a3b8",
  },
  metricSubtext: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 4,
  },
  gaugeTrack: {
    width: "100%",
    height: 6,
    borderRadius: 999,
    background: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    marginTop: 6,
  },
  gaugeFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #38bdf8 0%, #10b981 100%)",
    transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  compactBar: {
    display: "flex",
    alignItems: "center",
    padding: "8px 18px",
    gap: 12,
    fontSize: 12,
    color: "#cbd5e1",
    overflowX: "auto",
  },
  compactItem: {
    whiteSpace: "nowrap",
  },
  compactDivider: {
    color: "rgba(255, 255, 255, 0.2)",
  },
};
