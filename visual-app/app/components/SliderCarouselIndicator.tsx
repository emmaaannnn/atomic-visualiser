"use client";

import { useEffect, useRef } from "react";
import type { Placement } from "../lib/types";
import { colourForItem } from "../lib/utils";

interface SliderCarouselIndicatorProps {
  placements: Placement[];
  currentStep: number;
  onStepChange: (step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  showGhost: boolean;
  onToggleGhost: () => void;
  onFitNext: () => void;
  selectedItem: string | null;
  onSelectItem: (itemCode: string | null) => void;
  onSetCameraView?: (view: "iso" | "top" | "front" | "side") => void;
}

export function SliderCarouselIndicator({
  placements,
  currentStep,
  onStepChange,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
  showGhost,
  onToggleGhost,
  onFitNext,
  selectedItem,
  onSelectItem,
  onSetCameraView,
}: SliderCarouselIndicatorProps) {
  const totalSteps = placements.length;
  const isComplete = currentStep >= totalSteps;
  const nextPlacement = !isComplete ? placements[currentStep] : null;
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active carousel card into view
  useEffect(() => {
    if (!carouselRef.current) return;
    const activeEl = carouselRef.current.querySelector<HTMLElement>(
      `[data-step="${currentStep}"]`
    );
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentStep]);

  const handlePrev = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      onFitNext();
    }
  };

  return (
    <div style={styles.dockWrapper}>
      <div style={styles.dockCard}>
        {/* Top Control Bar: Timeline + Action Buttons */}
        <div style={styles.controlRow}>
          {/* Playback Controls */}
          <div style={styles.playbackGroup}>
            {/* Reset */}
            <button
              onClick={() => onStepChange(0)}
              style={styles.iconButton}
              title="Reset to empty box"
              aria-label="Reset to empty box"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>

            {/* Step Back */}
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              style={{
                ...styles.iconButton,
                ...(currentStep === 0 ? styles.disabledButton : {}),
              }}
              title="Previous package"
              aria-label="Previous package"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={onTogglePlay}
              style={styles.playButton}
              title={isPlaying ? "Pause automated packing" : "Play automated packing sequence"}
              aria-label={isPlaying ? "Pause automated packing" : "Play automated packing sequence"}
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
              <span style={styles.playButtonText}>{isPlaying ? "Pause" : "Play"}</span>
            </button>

            {/* Step Forward / Fit Next */}
            <button
              onClick={handleNext}
              disabled={isComplete}
              style={{
                ...styles.iconButton,
                ...(isComplete ? styles.disabledButton : {}),
              }}
              title="Next package"
              aria-label="Next package"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Prominent "Fit Next Package" Button */}
            {!isComplete && nextPlacement ? (
              <button onClick={onFitNext} style={styles.fitNextCta}>
                <span style={styles.fitIcon}>📦</span>
                <span>Fit Next: <strong>{nextPlacement.itemCode}</strong></span>
                <span style={styles.fitArrow}>↓</span>
              </button>
            ) : (
              <div style={styles.allPackedBadge}>
                <span>✓ All {totalSteps} Packages Packed</span>
              </div>
            )}
          </div>

          {/* Center Timeline Scrubber */}
          <div style={styles.timelineContainer}>
            <div style={styles.timelineHeader}>
              <span style={styles.timelineLabel}>
                PACKING PROGRESS · <strong>STEP {currentStep} OF {totalSteps}</strong>
              </span>
              <span style={styles.timelinePercent}>
                {totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 100}%
              </span>
            </div>

            <div style={styles.sliderWrapper}>
              <input
                type="range"
                min={0}
                max={totalSteps}
                step={1}
                value={currentStep}
                onChange={(e) => onStepChange(parseInt(e.target.value, 10))}
                style={styles.slider}
                aria-label="Packing sequence slider"
              />
              {/* Discrete Tick Marks */}
              <div style={styles.ticksRow}>
                <span style={styles.tickLabel}>Empty</span>
                {placements.map((_, i) => (
                  <span
                    key={i}
                    style={{
                      ...styles.tickLabel,
                      color: currentStep >= i + 1 ? "#38bdf8" : "#64748b",
                      fontWeight: currentStep === i + 1 ? 700 : 500,
                    }}
                  >
                    #{i + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Toolbar: Speed, Ghost Toggle, Camera Angles */}
          <div style={styles.toolbarGroup}>
            {/* Speed Selector */}
            <div style={styles.speedPills}>
              {[1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  style={{
                    ...styles.speedButton,
                    ...(playbackSpeed === s ? styles.speedButtonActive : {}),
                  }}
                  title={`Playback speed ${s}x`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Ghost Preview Toggle */}
            <button
              onClick={onToggleGhost}
              style={{
                ...styles.ghostToggle,
                ...(showGhost ? styles.ghostToggleActive : {}),
              }}
              title="Toggle holographic ghost preview of the next package"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>{showGhost ? "Preview On" : "Preview Off"}</span>
            </button>

            {/* Quick Camera Angles */}
            {onSetCameraView && (
              <div style={styles.cameraPills}>
                <button
                  onClick={() => onSetCameraView("iso")}
                  style={styles.cameraButton}
                  title="Isometric 3D View"
                >
                  3D
                </button>
                <button
                  onClick={() => onSetCameraView("top")}
                  style={styles.cameraButton}
                  title="Top-Down View"
                >
                  Top
                </button>
                <button
                  onClick={() => onSetCameraView("front")}
                  style={styles.cameraButton}
                  title="Front View"
                >
                  Front
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Carousel Track: Package Cards */}
        <div style={styles.carouselContainer}>
          <div ref={carouselRef} style={styles.carouselScroll}>
            {/* Step 0 Card: Empty State */}
            <div
              data-step={0}
              onClick={() => onStepChange(0)}
              style={{
                ...styles.card,
                ...(currentStep === 0 ? styles.cardActive : {}),
              }}
            >
              <div style={styles.cardHeader}>
                <span style={styles.emptyCircle}>○</span>
                <span style={styles.cardStepText}>START</span>
              </div>
              <div style={styles.cardTitle}>Empty Container</div>
              <div style={styles.cardSubtitle}>Ready for packing sequence</div>
              <div style={styles.cardFooter}>
                <span style={styles.statusPillNeutral}>
                  {currentStep === 0 ? "● Selected" : "Step 0"}
                </span>
              </div>
            </div>

            {/* Package Cards 1..N */}
            {placements.map((p, index) => {
              const order = index + 1;
              const isPacked = order <= currentStep;
              const isNext = order === currentStep + 1;
              const isCurrent = order === currentStep;
              const isSelected = selectedItem === p.itemCode;
              const colour = colourForItem(p.itemCode);

              const lCm = (p.placedDimension.length / 10).toFixed(0);
              const wCm = (p.placedDimension.width / 10).toFixed(0);
              const hCm = (p.placedDimension.depth / 10).toFixed(0);

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
                      <span style={styles.cardStepText}>ITEM #{order}</span>
                    </div>
                    {isNext && <span style={styles.nextBadge}>UP NEXT</span>}
                  </div>

                  <div style={styles.cardTitle} title={p.itemCode}>
                    {p.itemCode}
                  </div>

                  <div style={styles.cardSubtitle}>
                    {lCm} × {wCm} × {hCm} cm · {p.weight ?? 1} kg
                  </div>

                  <div style={styles.cardFooter}>
                    {isPacked ? (
                      <span style={styles.statusPillPacked}>
                        ✓ Packed
                      </span>
                    ) : isNext ? (
                      <span style={styles.statusPillNext}>
                        ▶ Click to Fit
                      </span>
                    ) : (
                      <span style={styles.statusPillPending}>
                        ⌛ In Queue
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  dockWrapper: {
    position: "absolute",
    bottom: 14,
    left: 16,
    right: 16,
    zIndex: 40,
    pointerEvents: "auto",
    display: "flex",
    justifyContent: "center",
  },
  dockCard: {
    width: "100%",
    maxWidth: 1280,
    background: "rgba(15, 23, 42, 0.90)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: 18,
    border: "1px solid rgba(255, 255, 255, 0.12)",
    boxShadow: "0 24px 50px rgba(15, 23, 42, 0.45), 0 0 1px rgba(255, 255, 255, 0.2)",
    color: "#f8fafc",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif",
    overflow: "hidden",
  },
  controlRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 18px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    gap: 16,
    flexWrap: "wrap",
  },
  playbackGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.06)",
    color: "#cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  disabledButton: {
    opacity: 0.35,
    cursor: "not-allowed",
  },
  playButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "0 14px",
    height: 34,
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 12,
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(37, 99, 235, 0.4)",
    transition: "background 0.15s ease",
  },
  playButtonText: {
    fontSize: 12,
  },
  fitNextCta: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 14px",
    height: 34,
    borderRadius: 8,
    border: "1px solid rgba(56, 189, 248, 0.4)",
    background: "linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(37, 99, 235, 0.3) 100%)",
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 0 14px rgba(56, 189, 248, 0.25)",
    transition: "all 0.15s ease",
  },
  fitIcon: {
    fontSize: 14,
  },
  fitArrow: {
    fontWeight: 800,
    color: "#38bdf8",
    fontSize: 14,
  },
  allPackedBadge: {
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    height: 34,
    borderRadius: 8,
    background: "rgba(16, 185, 129, 0.15)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    color: "#34d399",
    fontSize: 12,
    fontWeight: 600,
  },
  timelineContainer: {
    flex: 1,
    minWidth: 220,
    maxWidth: 480,
  },
  timelineHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  timelineLabel: {
    fontSize: 10,
    color: "#94a3b8",
    letterSpacing: "0.08em",
  },
  timelinePercent: {
    fontSize: 11,
    fontWeight: 700,
    color: "#38bdf8",
  },
  sliderWrapper: {
    position: "relative",
  },
  slider: {
    width: "100%",
    height: 6,
    borderRadius: 4,
    appearance: "none",
    background: "rgba(255, 255, 255, 0.15)",
    outline: "none",
    cursor: "pointer",
    accentColor: "#38bdf8",
  },
  ticksRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 2,
    padding: "0 2px",
  },
  tickLabel: {
    fontSize: 9,
    color: "#64748b",
  },
  toolbarGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  speedPills: {
    display: "flex",
    background: "rgba(0, 0, 0, 0.3)",
    padding: 2,
    borderRadius: 6,
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },
  speedButton: {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 4,
    cursor: "pointer",
  },
  speedButtonActive: {
    background: "rgba(255, 255, 255, 0.12)",
    color: "#ffffff",
  },
  ghostToggle: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    background: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    padding: "6px 10px",
    cursor: "pointer",
  },
  ghostToggleActive: {
    color: "#38bdf8",
    borderColor: "rgba(56, 189, 248, 0.4)",
    background: "rgba(56, 189, 248, 0.1)",
  },
  cameraPills: {
    display: "flex",
    background: "rgba(0, 0, 0, 0.3)",
    padding: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  cameraButton: {
    border: "none",
    background: "transparent",
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 4,
    cursor: "pointer",
  },
  carouselContainer: {
    padding: "10px 16px 14px",
    overflow: "hidden",
  },
  carouselScroll: {
    display: "flex",
    gap: 10,
    overflowX: "auto",
    paddingBottom: 4,
    scrollbarWidth: "thin",
  },
  card: {
    minWidth: 175,
    maxWidth: 200,
    flexShrink: 0,
    background: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 10,
    padding: "9px 12px",
    cursor: "pointer",
    transition: "all 0.18s ease",
  },
  cardActive: {
    background: "rgba(37, 99, 235, 0.18)",
    borderColor: "#38bdf8",
    boxShadow: "0 0 14px rgba(56, 189, 248, 0.25)",
  },
  cardSelected: {
    borderColor: "#ffffff",
    boxShadow: "0 0 16px rgba(255, 255, 255, 0.3)",
  },
  cardNextInQueue: {
    borderColor: "rgba(56, 189, 248, 0.6)",
    background: "rgba(56, 189, 248, 0.08)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  emptyCircle: {
    fontSize: 10,
    color: "#94a3b8",
  },
  cardStepText: {
    fontSize: 10,
    fontWeight: 700,
    color: "#94a3b8",
    letterSpacing: "0.06em",
  },
  nextBadge: {
    fontSize: 9,
    fontWeight: 800,
    color: "#38bdf8",
    background: "rgba(56, 189, 248, 0.15)",
    padding: "1px 5px",
    borderRadius: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#ffffff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.3,
  },
  cardSubtitle: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardFooter: {
    marginTop: 8,
    display: "flex",
    alignItems: "center",
  },
  statusPillPacked: {
    fontSize: 10,
    fontWeight: 600,
    color: "#34d399",
    background: "rgba(16, 185, 129, 0.15)",
    padding: "2px 6px",
    borderRadius: 4,
  },
  statusPillNext: {
    fontSize: 10,
    fontWeight: 700,
    color: "#38bdf8",
    background: "rgba(56, 189, 248, 0.18)",
    padding: "2px 6px",
    borderRadius: 4,
  },
  statusPillPending: {
    fontSize: 10,
    fontWeight: 500,
    color: "#64748b",
    background: "rgba(255, 255, 255, 0.04)",
    padding: "2px 6px",
    borderRadius: 4,
  },
  statusPillNeutral: {
    fontSize: 10,
    fontWeight: 500,
    color: "#94a3b8",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "2px 6px",
    borderRadius: 4,
  },
};
