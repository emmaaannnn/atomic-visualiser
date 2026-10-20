"use client";

import { useState, type CSSProperties } from "react";
import type { Placement } from "../lib/types";
import { colourForItem } from "../lib/utils";

interface AnimationPlaybarProps {
  totalSteps: number;
  currentStep: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  placements: Placement[];
  playbackSpeed?: number;
  onChangeSpeed?: (speed: number) => void;
}

export function AnimationPlaybar({
  totalSteps,
  currentStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
  placements,
  playbackSpeed,
  onChangeSpeed,
}: AnimationPlaybarProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const isComplete = currentStep >= totalSteps;

  const handlePrev = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      onStepChange(currentStep + 1);
    }
  };

  const handleReset = () => {
    onStepChange(0);
  };

  return (
    <div style={styles.container}>
      {/* Tooltip hovering over active or hovered dot */}
      {hoveredStep !== null && (
        <div style={styles.tooltip}>
          {hoveredStep === 0 ? (
            <span>Step 0: Empty Box</span>
          ) : (
            <span>
              <strong>#{hoveredStep}:</strong> {placements[hoveredStep - 1]?.itemCode ?? `Item ${hoveredStep}`}
              {placements[hoveredStep - 1] && (
                <span style={styles.tooltipDims}>
                  {" "}
                  ({(placements[hoveredStep - 1].placedDimension.length / 10).toFixed(0)}×
                  {(placements[hoveredStep - 1].placedDimension.width / 10).toFixed(0)}×
                  {(placements[hoveredStep - 1].placedDimension.height / 10).toFixed(0)} cm)
                </span>
              )}
            </span>
          )}
        </div>
      )}

      <div style={styles.playbarCard}>
        {/* Playback Controls */}
        <div style={styles.controlsGroup}>
          {/* Reset button */}
          <button
            onClick={handleReset}
            style={styles.iconBtn}
            title="Reset to empty box (Step 0)"
            aria-label="Reset to empty box"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>

          {/* Prev step */}
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            style={{
              ...styles.iconBtn,
              ...(currentStep === 0 ? styles.disabledBtn : {}),
            }}
            title="Previous package"
            aria-label="Previous package"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={onTogglePlay}
            style={styles.playBtn}
            title={isPlaying ? "Pause animation" : "Play packing animation"}
            aria-label={isPlaying ? "Pause animation" : "Play packing animation"}
          >
            {isPlaying ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          {/* Next step */}
          <button
            onClick={handleNext}
            disabled={isComplete}
            style={{
              ...styles.iconBtn,
              ...(isComplete ? styles.disabledBtn : {}),
            }}
            title="Next package"
            aria-label="Next package"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Vertical divider */}
        <div style={styles.divider} />

        {/* Animation Dots Track */}
        <div style={styles.dotsTrack}>
          {/* Dot 0: Start / Empty Box */}
          <button
            key="dot-0"
            onClick={() => onStepChange(0)}
            onMouseEnter={() => setHoveredStep(0)}
            onMouseLeave={() => setHoveredStep(null)}
            style={{
              ...styles.dot,
              ...(currentStep === 0 ? styles.dotActiveStart : styles.dotEmpty),
            }}
            title="Step 0: Empty Box"
            aria-label="Step 0: Empty Box"
          >
            {currentStep === 0 && <span style={styles.dotInnerPulse} />}
          </button>

          {/* Dots 1..N: One dot for each package */}
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNum = i + 1;
            const isPacked = stepNum <= currentStep;
            const isCurrent = stepNum === currentStep;
            const placement = placements[i];
            const itemColor = placement ? colourForItem(placement.itemCode) : "#38bdf8";

            return (
              <button
                key={`dot-${stepNum}`}
                onClick={() => onStepChange(stepNum)}
                onMouseEnter={() => setHoveredStep(stepNum)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{
                  ...styles.dot,
                  ...(isCurrent
                    ? {
                        ...styles.dotCurrent,
                        borderColor: itemColor,
                        backgroundColor: itemColor,
                        boxShadow: `0 0 12px ${itemColor}`,
                      }
                    : isPacked
                    ? {
                        ...styles.dotPacked,
                        backgroundColor: itemColor,
                      }
                    : styles.dotPending),
                }}
                title={`Step ${stepNum}: ${placement?.itemCode ?? `Item ${stepNum}`}`}
                aria-label={`Step ${stepNum}: ${placement?.itemCode ?? `Item ${stepNum}`}`}
              >
                {isCurrent && isPlaying && <span style={styles.dotPulsingGlow} />}
              </button>
            );
          })}
        </div>

        {/* Step Counter Badge */}
        <div style={styles.counterBadge}>
          <span style={styles.counterCurrent}>{currentStep}</span>
          <span style={styles.counterSlash}>/</span>
          <span style={styles.counterTotal}>{totalSteps}</span>
        </div>

      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    position: "absolute",
    bottom: 22,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 45,
    pointerEvents: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  tooltip: {
    background: "rgba(15, 23, 42, 0.95)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(56, 189, 248, 0.4)",
    borderRadius: 8,
    padding: "4px 10px",
    fontSize: 11,
    color: "#f8fafc",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.35)",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    animation: "fadeIn 0.15s ease",
  },
  tooltipDims: {
    color: "#94a3b8",
    fontSize: 10,
  },
  playbarCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "6px 14px",
    borderRadius: 9999,
    background: "rgba(15, 23, 42, 0.88)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.45), 0 0 1px rgba(255, 255, 255, 0.2)",
    color: "#f8fafc",
  },
  controlsGroup: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.06)",
    color: "#cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  disabledBtn: {
    opacity: 0.3,
    cursor: "not-allowed",
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #0284c7 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 12px rgba(37, 99, 235, 0.45)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  dotsTrack: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 4px",
    maxWidth: "50vw",
    overflowX: "auto",
    scrollbarWidth: "none",
  },
  dot: {
    position: "relative",
    width: 10,
    height: 10,
    borderRadius: "50%",
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    cursor: "pointer",
    padding: 0,
    outline: "none",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    flexShrink: 0,
  },
  dotEmpty: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.3)",
    width: 9,
    height: 9,
  },
  dotActiveStart: {
    backgroundColor: "#94a3b8",
    width: 12,
    height: 12,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    boxShadow: "0 0 8px rgba(148, 163, 184, 0.6)",
  },
  dotPending: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    width: 8,
    height: 8,
  },
  dotPacked: {
    opacity: 0.85,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "transparent",
    width: 10,
    height: 10,
  },
  dotCurrent: {
    width: 14,
    height: 14,
    transform: "scale(1.15)",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#ffffff",
  },
  dotInnerPulse: {
    display: "block",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    opacity: 0.7,
  },
  dotPulsingGlow: {
    position: "absolute",
    inset: -3,
    borderRadius: "50%",
    border: "1.5px solid #38bdf8",
    animation: "ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite",
  },
  counterBadge: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    fontSize: 11,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 9999,
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    letterSpacing: "0.04em",
    userSelect: "none",
  },
  counterCurrent: {
    color: "#38bdf8",
  },
  counterSlash: {
    color: "#64748b",
  },
  counterTotal: {
    color: "#94a3b8",
  },
  speedGroup: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    background: "rgba(0, 0, 0, 0.25)",
    padding: 2,
    borderRadius: 6,
  },
  speedBtn: {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: 600,
    padding: "2px 6px",
    borderRadius: 4,
    cursor: "pointer",
  },
  speedBtnActive: {
    background: "rgba(255, 255, 255, 0.15)",
    color: "#ffffff",
  },
};
