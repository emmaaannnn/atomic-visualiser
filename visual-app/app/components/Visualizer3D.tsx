"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OptimisationResult, Placement } from "../lib/types";
import { groupByBoxInstance, resolveContainerSize, formatDimensions } from "../lib/utils";
import { Box } from "./Box";
import { GhostBox } from "./GhostBox";
import { Container3D } from "./Container3D";
import { BoxSpecificationCard } from "./BoxSpecificationCard";
import { SliderCarouselIndicator } from "./SliderCarouselIndicator";

interface Visualizer3DProps {
  result: OptimisationResult;
}

function CameraRig({
  cameraView,
  containerCenter,
  containerSize,
}: {
  cameraView: "iso" | "top" | "front" | "side" | null;
  containerCenter: [number, number, number];
  containerSize: THREE.Vector3;
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (!cameraView) return;
    const maxDim = Math.max(containerSize.x, containerSize.y, containerSize.z, 1);

    if (cameraView === "iso") {
      camera.position.set(
        containerSize.x * 1.5 + 0.8,
        containerSize.y * 1.7 + 1.2,
        containerSize.z * 1.7 + 0.8
      );
    } else if (cameraView === "top") {
      camera.position.set(
        containerCenter[0],
        containerCenter[1] + maxDim * 2.8,
        containerCenter[2] + 0.001
      );
    } else if (cameraView === "front") {
      camera.position.set(
        containerCenter[0],
        containerCenter[1] + 0.5,
        containerCenter[2] + maxDim * 2.5
      );
    } else if (cameraView === "side") {
      camera.position.set(
        containerCenter[0] + maxDim * 2.5,
        containerCenter[1] + 0.5,
        containerCenter[2]
      );
    }
    camera.lookAt(containerCenter[0], containerCenter[1], containerCenter[2]);
  }, [cameraView, camera, containerCenter, containerSize]);

  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.08}
      target={containerCenter}
    />
  );
}

export function Visualizer3D({ result }: Visualizer3DProps) {
  const groups = useMemo(() => groupByBoxInstance(result.placements), [result.placements]);
  const boxInstances = useMemo(() => Array.from(groups.keys()).sort((a, b) => a - b), [groups]);

  // Active carton instance
  const [activeInstance, setActiveInstance] = useState<number>(boxInstances[0] ?? 1);
  const placements = useMemo(() => groups.get(activeInstance) ?? [], [groups, activeInstance]);
  const usedBox = useMemo(
    () => result.usedBoxes.find((b) => b.boxInstance === activeInstance),
    [result.usedBoxes, activeInstance]
  );
  const containerSize = useMemo(() => resolveContainerSize(usedBox), [usedBox]);

  // Packing timeline animation state
  const [currentStep, setCurrentStep] = useState<number>(placements.length);
  const [animatingStep, setAnimatingStep] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showGhost, setShowGhost] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [cameraView, setCameraView] = useState<"iso" | "top" | "front" | "side" | null>("iso");

  // Ensure activeInstance is always valid for the current result
  useEffect(() => {
    if (boxInstances.length > 0 && !boxInstances.includes(activeInstance)) {
      setActiveInstance(boxInstances[0]);
    }
  }, [boxInstances, activeInstance]);

  // When result or active carton changes, cleanly stop playback and reset timeline
  useEffect(() => {
    setIsPlaying(false);
    setAnimatingStep(null);
    setSelectedItem(null);
    setCurrentStep(placements.length);
  }, [result, activeInstance, placements.length]);

  // Automated playback sequence
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(400, 1400 / playbackSpeed);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < placements.length) {
          const next = prev + 1;
          setAnimatingStep(next);
          return next;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, placements.length]);

  const handleStepChange = (newStep: number) => {
    setIsPlaying(false);
    if (newStep > currentStep) {
      setAnimatingStep(newStep);
    } else {
      setAnimatingStep(null);
    }
    setCurrentStep(newStep);
  };

  const handleFitNext = () => {
    if (currentStep < placements.length) {
      const next = currentStep + 1;
      setAnimatingStep(next);
      setCurrentStep(next);
      setSelectedItem(placements[currentStep].itemCode);
    }
  };

  const containerCenter: [number, number, number] = useMemo(
    () => [containerSize.x / 2, containerSize.y / 2, containerSize.z / 2],
    [containerSize]
  );
  const maxSpan = Math.max(containerSize.x, containerSize.y, containerSize.z, 0.1);
  const hasPlacements = placements.length > 0;

  // Selected placement details
  const selectedPlacement = placements.find((p) => p.itemCode === selectedItem) ?? null;
  const selectedOrder = selectedPlacement
    ? placements.findIndex((p) => p.itemCode === selectedPlacement.itemCode) + 1
    : 0;

  return (
    <div style={styles.root}>
      {/* 3D WebGL Canvas wrapped in an isolated stacking context */}
      <div style={styles.canvasWrapper}>
        <Canvas
          camera={{
            position: [
              containerSize.x * 1.5 + 0.8,
              containerSize.y * 1.7 + 1.2,
              containerSize.z * 1.7 + 0.8,
            ],
            fov: 45,
          }}
          onPointerMissed={() => setSelectedItem(null)}
        >
          <ambientLight intensity={0.75} />
          <directionalLight position={[8, 12, 8]} intensity={0.85} />
          <directionalLight position={[-8, 6, -6]} intensity={0.35} />

          {/* Realistic 3D Container with base plate & measurement annotations */}
          <Container3D containerSize={containerSize} usedBox={usedBox} />

          {/* Packed Boxes (animated entrance when step reached) */}
          {hasPlacements &&
            placements.slice(0, currentStep).map((placement, i) => (
              <Box
                key={`${placement.boxInstance}-${placement.itemCode}-${i}`}
                placement={placement}
                order={i + 1}
                selected={selectedItem === placement.itemCode}
                onSelect={setSelectedItem}
                isNewlyPlaced={animatingStep === i + 1}
                containerHeight={containerSize.y}
                containerSize={containerSize}
              />
            ))}

          {/* Holographic Ghost Blueprint for the Next Package */}
          {showGhost && currentStep < placements.length && (
            <GhostBox
              placement={placements[currentStep]}
              order={currentStep + 1}
              onFitNext={handleFitNext}
              containerSize={containerSize}
            />
          )}

          {/* Studio Floor Grid */}
          <Grid
            position={[containerSize.x / 2, 0, containerSize.z / 2]}
            args={[containerSize.x * 3.5, containerSize.z * 3.5]}
            cellColor="#cbd5e1"
            sectionColor="#94a3b8"
            fadeDistance={maxSpan * 8}
          />

          {/* Camera Rig & Orbit Controls */}
          <CameraRig
            cameraView={cameraView}
            containerCenter={containerCenter}
            containerSize={containerSize}
          />
        </Canvas>
      </div>

      {/* TOP: Specification Card of whichever box is selected */}
      <BoxSpecificationCard
        usedBox={usedBox}
        availableBoxes={result.usedBoxes}
        activeInstance={activeInstance}
        onSelectInstance={(id) => {
          setActiveInstance(id);
          setCameraView("iso");
        }}
        currentPlacements={placements}
        currentStep={currentStep}
      />

      {/* BOTTOM: Slider Carousel Indicator with Playback Controls & Next Package Preview */}
      {hasPlacements && (
        <SliderCarouselIndicator
          placements={placements}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          playbackSpeed={playbackSpeed}
          onChangeSpeed={setPlaybackSpeed}
          showGhost={showGhost}
          onToggleGhost={() => setShowGhost(!showGhost)}
          onFitNext={handleFitNext}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
          onSetCameraView={setCameraView}
        />
      )}

      {/* Empty State if no placements */}
      {!hasPlacements && (
        <div style={styles.emptyState}>
          <div style={styles.emptyTitle}>No Placements in Carton #{activeInstance}</div>
          <div style={styles.emptyText}>
            This carton does not contain any assigned items in the current payload.
          </div>
        </div>
      )}

      {/* Floating Selected Package Inspector Pill */}
      {selectedPlacement && (
        <div style={styles.selectedItemPill}>
          <div style={styles.pillHeader}>
            <span style={styles.pillBadge}>ITEM #{selectedOrder}</span>
            <strong style={styles.pillTitle}>{selectedPlacement.itemCode}</strong>
            <button
              style={styles.pillClose}
              onClick={() => setSelectedItem(null)}
              aria-label="Close item details"
            >
              ×
            </button>
          </div>
          <div style={styles.pillRow}>
            <span>
              <strong>Dimensions:</strong>{" "}
              {(selectedPlacement.placedDimension.length / 10).toFixed(0)} ×{" "}
              {(selectedPlacement.placedDimension.width / 10).toFixed(0)} ×{" "}
              {(selectedPlacement.placedDimension.depth / 10).toFixed(0)} cm
            </span>
            <span>·</span>
            <span>
              <strong>Weight:</strong> {selectedPlacement.weight ?? 1} kg
            </span>
            <span>·</span>
            <span>
              <strong>Position:</strong> (x:{" "}
              {(selectedPlacement.position.x / 10).toFixed(0)}, y:{" "}
              {(selectedPlacement.position.y / 10).toFixed(0)}, z:{" "}
              {(selectedPlacement.position.z / 10).toFixed(0)} cm)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  root: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "480px",
    touchAction: "none",
    overflow: "hidden",
  },
  canvasWrapper: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    isolation: "isolate",
  },
  emptyState: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px 28px",
    borderRadius: 14,
    background: "rgba(15, 23, 42, 0.9)",
    backdropFilter: "blur(16px)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    textAlign: "center",
    color: "#f8fafc",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: "#94a3b8",
  },
  selectedItemPill: {
    position: "absolute",
    top: 180,
    right: 18,
    zIndex: 35,
    background: "rgba(15, 23, 42, 0.92)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(56, 189, 248, 0.4)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: "10px 14px",
    color: "#ffffff",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    maxWidth: 380,
  },
  pillHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  pillBadge: {
    fontSize: 10,
    fontWeight: 700,
    color: "#38bdf8",
    background: "rgba(56, 189, 248, 0.15)",
    padding: "2px 6px",
    borderRadius: 4,
  },
  pillTitle: {
    fontSize: 13,
    color: "#ffffff",
    flex: 1,
  },
  pillClose: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: 18,
    cursor: "pointer",
    lineHeight: 1,
    padding: 2,
  },
  pillRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 11,
    color: "#cbd5e1",
    flexWrap: "wrap",
  },
};
