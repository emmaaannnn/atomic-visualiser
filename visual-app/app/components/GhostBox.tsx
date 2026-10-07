"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Placement } from "../lib/types";
import { cornerToCenter, dimensionToVector, positionToVector } from "../lib/utils";

interface GhostBoxProps {
  placement: Placement;
  order: number;
  onFitNext: () => void;
  containerSize?: THREE.Vector3;
}

export function GhostBox({ placement, order, onFitNext, containerSize }: GhostBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const size = useMemo(
    () => dimensionToVector(placement.placedDimension),
    [placement.placedDimension]
  );
  const corner = useMemo(() => positionToVector(placement.position), [placement.position]);
  const center = useMemo(() => cornerToCenter(corner, size), [corner, size]);

  const lCm = (placement.placedDimension.length / 10).toFixed(0);
  const wCm = (placement.placedDimension.width / 10).toFixed(0);
  const hCm = (placement.placedDimension.depth / 10).toFixed(0);

  // Floating 3D Guideline and Callout (Screen-Space Consistent)
  return (
    <group position={center}>
      {/* Ghost translucent mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onFitNext();
        }}
      >
        <boxGeometry args={[size.x, size.y, size.z]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#38bdf8"
          transparent
          opacity={0.3}
          wireframe={false}
          depthWrite={false}
        />
      </mesh>

      {/* Cyan outline / edges */}
      <lineSegments>
        <edgesGeometry
          args={[new THREE.BoxGeometry(size.x, size.y, size.z)]}
        />
        <lineBasicMaterial color="#00f3ff" linewidth={2} />
      </lineSegments>

      {/* Floating 3D Callout */}
      <Html
        position={[0, size.y * 0.5 + 0.15, 0]}
        center
        zIndexRange={[0, 10]}
        style={{ pointerEvents: "auto", cursor: "pointer" }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFitNext();
          }}
          style={styles.ghostBadge}
          title="Click to pack this package into the container"
        >
          <div style={styles.badgeTop}>
            <span style={styles.nextDot} />
            <span style={styles.nextText}>
              Next to fit (#{order})
            </span>
          </div>
          <div style={styles.itemTitle}>
            {placement.itemCode}
          </div>
          <div style={styles.dimsText}>
            {lCm} × {wCm} × {hCm} cm · {placement.weight ?? 1} kg
          </div>
          <div style={styles.clickHint}>
            Click to Fit ↓
          </div>
        </button>
      </Html>
    </group>
  );
}

const styles: Record<string, React.CSSProperties> = {
  ghostBadge: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif",
    background: "rgba(15, 23, 42, 0.94)",
    border: "1.5px solid rgba(56, 189, 248, 0.7)",
    borderRadius: 8,
    padding: "6px 12px",
    maxWidth: "200px",
    color: "#ffffff",
    boxShadow:
      "0 6px 22px rgba(0, 243, 255, 0.4), 0 0 14px rgba(15, 23, 42, 0.7)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    whiteSpace: "nowrap",
    cursor: "pointer",
    textAlign: "center",
    transition: "transform 0.15s ease",
  },
  badgeTop: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  nextDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: "#38bdf8",
    boxShadow: "0 0 8px #38bdf8",
  },
  nextText: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#38bdf8",
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#ffffff",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
  },
  dimsText: {
    fontSize: 10,
    color: "#cbd5e1",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
  },
  clickHint: {
    fontSize: 10,
    fontWeight: 700,
    color: "#10b981",
    marginTop: 2,
    background: "rgba(16, 185, 129, 0.2)",
    padding: "2px 7px",
    borderRadius: 4,
  },
};
