"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OptimisationResult } from "../lib/types";
import { groupByBoxInstance, resolveContainerSize } from "../lib/utils";
import { Box } from "./Box";

interface Visualizer3DProps {
  result: OptimisationResult;
}

export function Visualizer3D({ result }: Visualizer3DProps) {
  const groups = useMemo(() => groupByBoxInstance(result.placements), [result.placements]);
  const boxInstances = useMemo(() => Array.from(groups.keys()).sort((a, b) => a - b), [groups]);
  const [activeInstance, setActiveInstance] = useState<number>(boxInstances[0] ?? 0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const placements = groups.get(activeInstance) ?? [];
  const usedBox = result.usedBoxes.find((b) => b.boxInstance === activeInstance)!;
  const containerSize = useMemo(() => resolveContainerSize(usedBox), [usedBox]);

  const selectedPlacement = placements.find((p) => p.itemCode === selectedItem) ?? null;
  const selectedOrder = selectedPlacement
    ? placements.findIndex((p) => p.itemCode === selectedPlacement.itemCode) + 1
    : 0;

  const containerCenter: [number, number, number] = [
    containerSize.x / 2,
    containerSize.y / 2,
    containerSize.z / 2,
  ];
  const maxSpan = Math.max(containerSize.x, containerSize.y, containerSize.z, 0.1);

  return (
    <div style={styles.root}>
      <Canvas
        camera={{
          position: [containerSize.x * 1.6 + 0.5, containerSize.y * 1.8 + 1, containerSize.z * 1.8 + 0.5],
          fov: 45,
        }}
        onPointerMissed={() => setSelectedItem(null)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} />
        <directionalLight position={[-5, 4, -5]} intensity={0.3} />

        <group position={containerCenter}>
          <lineSegments>
            <edgesGeometry
              args={[new THREE.BoxGeometry(containerSize.x, containerSize.y, containerSize.z)]}
            />
            <lineBasicMaterial color="#1F2937" />
          </lineSegments>
        </group>

        {placements.map((placement, i) => (
          <Box
            key={`${placement.boxInstance}-${placement.itemCode}`}
            placement={placement}
            order={i + 1}
            selected={selectedItem === placement.itemCode}
            onSelect={setSelectedItem}
          />
        ))}

        <Grid
          position={[containerSize.x / 2, 0, containerSize.z / 2]}
          args={[containerSize.x * 3, containerSize.z * 3]}
          cellColor="#e5e7eb"
          sectionColor="#d1d5db"
          fadeDistance={maxSpan * 8}
        />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.12}
          minDistance={maxSpan * 0.3}
          maxDistance={maxSpan * 8}
          target={containerCenter}
        />
      </Canvas>

      {boxInstances.length > 1 && (
        <div style={styles.instanceSwitcher}>
          {boxInstances.map((id) => (
            <button
              key={id}
              onClick={() => {
                setActiveInstance(id);
                setSelectedItem(null);
              }}
              style={{
                ...styles.instanceButton,
                ...(id === activeInstance ? styles.instanceButtonActive : {}),
              }}
            >
              Carton {id}
            </button>
          ))}
        </div>
      )}

      {selectedPlacement && (
        <div style={styles.infoPanel}>
          <div style={styles.infoHeader}>
            <span style={styles.infoTitle}>{selectedPlacement.itemCode}</span>
            <button style={styles.closeButton} onClick={() => setSelectedItem(null)} aria-label="Close">
              ×
            </button>
          </div>
          <dl style={styles.infoGrid}>
            <dt style={styles.infoLabel}>Carton</dt>
            <dd style={styles.infoValue}>
              {selectedPlacement.boxReference} #{selectedPlacement.boxInstance}
            </dd>

            <dt style={styles.infoLabel}>Placed order</dt>
            <dd style={styles.infoValue}>
              {selectedOrder} of {placements.length}
            </dd>

            <dt style={styles.infoLabel}>Dimensions (L×W×D, mm)</dt>
            <dd style={styles.infoValue}>
              {selectedPlacement.placedDimension.length} × {selectedPlacement.placedDimension.width} ×{" "}
              {selectedPlacement.placedDimension.depth}
            </dd>

            <dt style={styles.infoLabel}>Position (mm)</dt>
            <dd style={styles.infoValue}>
              x{selectedPlacement.position.x}, y{selectedPlacement.position.y}, z{selectedPlacement.position.z}
            </dd>
          </dl>
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
  },
  instanceSwitcher: {
    position: "absolute",
    top: 12,
    left: 12,
    display: "flex",
    gap: 6,
  },
  instanceButton: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: 13,
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#374151",
    cursor: "pointer",
  },
  instanceButtonActive: {
    background: "#1F2937",
    color: "#ffffff",
    borderColor: "#1F2937",
  },
  infoPanel: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    maxWidth: 320,
    background: "rgba(255,255,255,0.97)",
    borderRadius: 10,
    padding: "12px 14px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.14)",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  infoHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
  },
  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: 18,
    lineHeight: 1,
    color: "#6B7280",
    cursor: "pointer",
    padding: 4,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    columnGap: 12,
    rowGap: 5,
    margin: 0,
    fontSize: 12.5,
  },
  infoLabel: {
    color: "#6B7280",
  },
  infoValue: {
    color: "#111827",
    fontWeight: 500,
    textAlign: "right",
  },
};
