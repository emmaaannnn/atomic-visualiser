"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { Placement } from "../lib/types";
import { colourForItem } from "../lib/utils";

interface PackageSidebarProps {
  placements: Placement[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onFitNext: () => void;
  selectedItem: string | null;
  onSelectItem: (itemCode: string | null) => void;
  showGhost: boolean;
  onToggleGhost: () => void;
  onSetCameraView?: (view: "iso" | "top" | "front" | "side") => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function PackageSidebar({
  placements,
  currentStep,
  onStepChange,
  onFitNext,
  selectedItem,
  onSelectItem,
  showGhost,
  onToggleGhost,
  onSetCameraView,
  isCollapsed,
  onToggleCollapse,
}: PackageSidebarProps) {
  const totalSteps = placements.length;
  const isComplete = currentStep >= totalSteps;
  const nextPlacement = !isComplete ? placements[currentStep] : null;
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active item card into view
  useEffect(() => {
    if (!listRef.current || isCollapsed) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(
      `[data-step="${currentStep}"]`
    );
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentStep, isCollapsed]);


  if (isCollapsed) {
    return (
      <div style={styles.collapsedWrapper}>
        <button
          onClick={onToggleCollapse}
          style={styles.expandTrigger}
          title="Open package list sidebar"
          aria-label="Open package list sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span style={styles.collapsedBadge}>
            {currentStep}/{totalSteps}
          </span>
          <span style={styles.collapsedVerticalText}>PACKAGES</span>
        </button>
      </div>
    );
  }
  
  return (
    <aside style={styles.sidebarWrapper} aria-label="Package sequence sidebar">
      
      
      {/* Sidebar Header */}
      <div style={styles.header}>
        <div style={styles.headerTitleGroup}>
          <div style={styles.boxIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div>
            <div style={styles.headerKicker}>SEQUENCE QUEUE</div>
            <div style={styles.headerTitle}>Package List</div>
          </div>
        </div>

        <div style={styles.headerRight}>
          <span style={styles.progressPill}>
            {currentStep}/{totalSteps} Packed
          </span>
          <button
            onClick={onToggleCollapse}
            style={styles.collapseBtn}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div style={styles.quickActions}>
        {/* Fit Next CTA */}
        {!isComplete && nextPlacement ? (
          <button onClick={onFitNext} style={styles.fitNextBtn}>
            <span style={styles.fitIcon}>📦</span>
            <span style={styles.fitNextLabel}>
              Fit Next: <strong>{nextPlacement.itemCode}</strong>
            </span>
            <span style={styles.fitArrow}>↓</span>
          </button>
        ) : (
          <div style={styles.allPackedBanner}>
            <span>✓ All {totalSteps} Packages Packed</span>
          </div>
        )}

        {/* Toggles Bar: Ghost Preview & Quick Camera Views */}
        <div style={styles.togglesRow}>
          {/* Ghost Preview Toggle */}
          <button
            onClick={onToggleGhost}
            style={{
              ...styles.toggleBtn,
              ...(showGhost ? styles.toggleBtnActive : {}),
            }}
            title="Toggle next package holographic preview"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{showGhost ? "Preview On" : "Preview Off"}</span>
          </button>

        </div>
      </div>

      {/* Scrollable Package Cards List */}
      <div ref={listRef} style={styles.cardsList}>
        {/* Packages 1..N */}
        {placements.map((p, index) => {
          const order = index + 1;
          const isPacked = order <= currentStep;
          const isNext = order === currentStep + 1;
          const isCurrent = order === currentStep;
          const isSelected = selectedItem === p.itemCode;
          const colour = colourForItem(p.itemCode);

          const lCm = (p.placedDimension.length / 10).toFixed(0);
          const wCm = (p.placedDimension.width / 10).toFixed(0);
          const hCm = (p.placedDimension.height / 10).toFixed(0);

          return (
            <div
              key={`${p.boxInstance}-${p.itemCode}-${order}`}
              data-step={order}
              onClick={() => {
                if (isNext) {
                  onFitNext();
                } else {
                  onStepChange(order);
                }
                onSelectItem(p.itemCode);
              }}
              style={{
                ...styles.card,
                ...(isCurrent ? styles.cardActive : {}),
                ...(isSelected ? styles.cardSelected : {}),
                ...(isNext ? styles.cardNextInQueue : {}),
              }}
            >
              <div style={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      ...styles.colorDot,
                      backgroundColor: colour,
                      boxShadow: `0 0 8px ${colour}`,
                    }}
                  />
                  <span style={styles.cardStepLabel}>ITEM #{order}</span>
                </div>
                {isNext ? (
                  <span style={styles.statusPillNext}>▶ Click to Fit</span>
                ) : isPacked ? (
                  <span style={styles.statusPillPacked}>✓ Packed</span>
                ) : (
                  <span style={styles.statusPillPending}>In Queue</span>
                )}
              </div>

              <div style={styles.cardTitle} title={p.itemCode}>
                {p.itemCode}
              </div>

              <div style={styles.cardSubtitle}>
                {lCm} × {wCm} × {hCm} cm · {p.weight ?? 1} kg
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

const styles: Record<string, CSSProperties> = {
  sidebarWrapper: {
    position: "absolute",
    left: 16,
    top: 14,
    bottom: 80,
    width: 310,
    zIndex: 39,
    display: "flex",
    flexDirection: "column",
    background: "rgba(15, 23, 42, 0.88)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.5), 0 0 1px rgba(255, 255, 255, 0.2)",
    color: "#f8fafc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif",
    overflow: "hidden",
    pointerEvents: "auto",
    transition: "transform 0.25s ease, opacity 0.25s ease",
  },
  collapsedWrapper: {
    position: "absolute",
    left: 16,
    top: 14,
    zIndex: 39,
    pointerEvents: "auto",
  },
  expandTrigger: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: "12px 8px",
    borderRadius: 14,
    background: "rgba(15, 23, 42, 0.88)",
    backdropFilter: "blur(16px)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.15)",
    color: "#f8fafc",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
    transition: "background 0.15s ease",
  },
  collapsedBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: "#38bdf8",
    background: "rgba(56, 189, 248, 0.15)",
    padding: "2px 6px",
    borderRadius: 6,
  },
  collapsedVerticalText: {
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#94a3b8",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    gap: 8,
  },
  headerTitleGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  boxIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "rgba(56, 189, 248, 0.15)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerKicker: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#38bdf8",
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#ffffff",
    lineHeight: 1.2,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  progressPill: {
    fontSize: 10,
    fontWeight: 700,
    color: "#38bdf8",
    background: "rgba(56, 189, 248, 0.12)",
    padding: "2px 6px",
    borderRadius: 6,
    border: "1px solid rgba(56, 189, 248, 0.25)",
  },
  collapseBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  quickActions: {
    padding: "10px 14px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  fitNextBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid rgba(56, 189, 248, 0.4)",
    background: "linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(37, 99, 235, 0.3) 100%)",
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 0 12px rgba(56, 189, 248, 0.2)",
    transition: "all 0.15s ease",
  },
  fitIcon: {
    fontSize: 13,
  },
  fitNextLabel: {
    flex: 1,
    textAlign: "left",
    marginLeft: 6,
  },
  fitArrow: {
    fontWeight: 800,
    fontSize: 13,
  },
  allPackedBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 12px",
    borderRadius: 8,
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    color: "#34d399",
    fontSize: 11,
    fontWeight: 600,
  },
  togglesRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  toggleBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    background: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    padding: "5px 8px",
    cursor: "pointer",
  },
  toggleBtnActive: {
    color: "#38bdf8",
    borderColor: "rgba(56, 189, 248, 0.4)",
    background: "rgba(56, 189, 248, 0.12)",
  },
  cameraGroup: {
    display: "flex",
    background: "rgba(0, 0, 0, 0.25)",
    padding: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  camBtn: {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: 600,
    padding: "3px 7px",
    borderRadius: 4,
    cursor: "pointer",
  },
  cardsList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    scrollbarWidth: "thin",
  },
  card: {
    background: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 8,
    padding: "8px 10px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  cardActive: {
    background: "rgba(37, 99, 235, 0.18)",
    borderColor: "#38bdf8",
    boxShadow: "0 0 12px rgba(56, 189, 248, 0.25)",
  },
  cardSelected: {
    borderColor: "#ffffff",
    boxShadow: "0 0 14px rgba(255, 255, 255, 0.3)",
  },
  cardNextInQueue: {
    borderColor: "rgba(56, 189, 248, 0.5)",
    background: "rgba(56, 189, 248, 0.07)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  emptyDot: {
    fontSize: 10,
    color: "#94a3b8",
  },
  cardStepLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: "#94a3b8",
    letterSpacing: "0.06em",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#ffffff",
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardSubtitle: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  statusPillPacked: {
    fontSize: 9,
    fontWeight: 600,
    color: "#34d399",
    background: "rgba(16, 185, 129, 0.15)",
    padding: "1px 5px",
    borderRadius: 4,
  },
  statusPillNext: {
    fontSize: 9,
    fontWeight: 700,
    color: "#38bdf8",
    background: "rgba(56, 189, 248, 0.18)",
    padding: "1px 5px",
    borderRadius: 4,
  },
  statusPillPending: {
    fontSize: 9,
    fontWeight: 500,
    color: "#64748b",
    background: "rgba(255, 255, 255, 0.04)",
    padding: "1px 5px",
    borderRadius: 4,
  },
  statusPillNeutral: {
    fontSize: 9,
    fontWeight: 500,
    color: "#94a3b8",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "1px 5px",
    borderRadius: 4,
  },
};
