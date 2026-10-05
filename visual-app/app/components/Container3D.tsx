"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import type { UsedBox } from "../lib/types";
import { formatDimensions } from "../lib/utils";

interface Container3DProps {
  containerSize: THREE.Vector3;
  usedBox?: UsedBox;
}

const MAROON = "#991b1b";
const MAROON_DARK = "#7f1d1d";

export function Container3D({ containerSize, usedBox }: Container3DProps) {
  const containerCenter: [number, number, number] = useMemo(
    () => [containerSize.x / 2, containerSize.y / 2, containerSize.z / 2],
    [containerSize]
  );

  const dims = useMemo(() => {
    if (!usedBox?.dimension) return null;
    return formatDimensions(usedBox.dimension);
  }, [usedBox]);

  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(
      new THREE.BoxGeometry(containerSize.x, containerSize.y, containerSize.z)
    );
  }, [containerSize]);

  // Dimension offsets
  const xOffsetZ = containerSize.z + 0.38;
  const zOffsetX = -0.38;
  const yOffsetX = -0.38;
  const yOffsetZ = containerSize.z + 0.38;

  return (
    <group>
      {/* Container Base Floor Plate */}
      <mesh
        position={[containerCenter[0], 0.005, containerCenter[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[containerSize.x, containerSize.z]} />
        <meshStandardMaterial
          color="#334155"
          transparent
          opacity={0.35}
          roughness={0.8}
        />
      </mesh>

      {/* Container Outer Boundary Cage / Translucent Walls */}
      <mesh position={containerCenter}>
        <boxGeometry args={[containerSize.x, containerSize.y, containerSize.z]} />
        <meshStandardMaterial
          color="#64748b"
          transparent
          opacity={0.07}
          roughness={0.9}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Container Edge Wireframe */}
      <group position={containerCenter}>
        <lineSegments geometry={edgesGeometry}>
          <lineBasicMaterial color="#334155" linewidth={1.5} />
        </lineSegments>
      </group>

      {/* 3D Maroon Dimension Arrows Across the Box */}
      {dims && (
        <group>
          {/* ======================================================== */}
          {/* 1. WIDTH ARROW (Along X-Axis across the front of the box) */}
          {/* ======================================================== */}
          <group position={[0, 0.03, xOffsetZ]}>
            {/* Main Maroon Stem Bar */}
            <mesh position={[containerSize.x / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, containerSize.x, 8]} />
              <meshStandardMaterial
                color={MAROON}
                emissive={MAROON_DARK}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Left Maroon Arrowhead Cone pointing -X */}
            <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[0.065, 0.2, 12]} />
              <meshStandardMaterial color={MAROON} emissive={MAROON_DARK} />
            </mesh>

            {/* Right Maroon Arrowhead Cone pointing +X */}
            <mesh position={[containerSize.x - 0.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.065, 0.2, 12]} />
              <meshStandardMaterial color={MAROON} emissive={MAROON_DARK} />
            </mesh>

            {/* Left Extension Tick Line */}
            <mesh position={[0, 0, -0.19]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.38, 6]} />
              <meshBasicMaterial color={MAROON} />
            </mesh>

            {/* Right Extension Tick Line */}
            <mesh position={[containerSize.x, 0, -0.19]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.38, 6]} />
              <meshBasicMaterial color={MAROON} />
            </mesh>

            {/* Screen-Space UI-Themed Maroon Measurement Badge */}
            <Html position={[containerSize.x / 2, 0, 0]} center zIndexRange={[0, 10]} style={{ pointerEvents: "none" }}>
              <div style={styles.maroonBadge}>
                <span style={styles.arrowIcon}>↔</span>
                <span style={styles.axisTitle}>Width:</span>
                <span style={styles.axisValue}>{dims.widthCm} cm</span>
              </div>
            </Html>
          </group>

          {/* ======================================================== */}
          {/* 2. DEPTH ARROW (Along Z-Axis along the side of the box)   */}
          {/* ======================================================== */}
          <group position={[zOffsetX, 0.03, 0]}>
            {/* Main Maroon Stem Bar */}
            <mesh position={[0, 0, containerSize.z / 2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, containerSize.z, 8]} />
              <meshStandardMaterial
                color={MAROON}
                emissive={MAROON_DARK}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Back Maroon Arrowhead Cone pointing -Z */}
            <mesh position={[0, 0, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.065, 0.2, 12]} />
              <meshStandardMaterial color={MAROON} emissive={MAROON_DARK} />
            </mesh>

            {/* Front Maroon Arrowhead Cone pointing +Z */}
            <mesh position={[0, 0, containerSize.z - 0.1]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.065, 0.2, 12]} />
              <meshStandardMaterial color={MAROON} emissive={MAROON_DARK} />
            </mesh>

            {/* Back Extension Tick Line */}
            <mesh position={[0.19, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.38, 6]} />
              <meshBasicMaterial color={MAROON} />
            </mesh>

            {/* Front Extension Tick Line */}
            <mesh position={[0.19, 0, containerSize.z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.38, 6]} />
              <meshBasicMaterial color={MAROON} />
            </mesh>

            {/* Screen-Space UI-Themed Maroon Measurement Badge */}
            <Html position={[0, 0, containerSize.z / 2]} center zIndexRange={[0, 10]} style={{ pointerEvents: "none" }}>
              <div style={styles.maroonBadge}>
                <span style={styles.arrowIcon}>↕</span>
                <span style={styles.axisTitle}>Depth:</span>
                <span style={styles.axisValue}>{dims.heightCm} cm</span>
              </div>
            </Html>
          </group>

          {/* ======================================================== */}
          {/* 3. LENGTH / HEIGHT ARROW (Along Vertical Y-Axis)        */}
          {/* ======================================================== */}
          <group position={[yOffsetX, 0, yOffsetZ]}>
            {/* Main Maroon Stem Bar */}
            <mesh position={[0, containerSize.y / 2, 0]}>
              <cylinderGeometry args={[0.015, 0.015, containerSize.y, 8]} />
              <meshStandardMaterial
                color={MAROON}
                emissive={MAROON_DARK}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Bottom Maroon Arrowhead Cone pointing -Y */}
            <mesh position={[0, 0.1, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.065, 0.2, 12]} />
              <meshStandardMaterial color={MAROON} emissive={MAROON_DARK} />
            </mesh>

            {/* Top Maroon Arrowhead Cone pointing +Y */}
            <mesh position={[0, containerSize.y - 0.1, 0]}>
              <coneGeometry args={[0.065, 0.2, 12]} />
              <meshStandardMaterial color={MAROON} emissive={MAROON_DARK} />
            </mesh>

            {/* Bottom Extension Tick Line reaching corner */}
            <mesh position={[0.19, 0, -0.19]} rotation={[0, -Math.PI / 4, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.53, 6]} />
              <meshBasicMaterial color={MAROON} />
            </mesh>

            {/* Top Extension Tick Line reaching corner */}
            <mesh position={[0.19, containerSize.y, -0.19]} rotation={[0, -Math.PI / 4, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, 0.53, 6]} />
              <meshBasicMaterial color={MAROON} />
            </mesh>

            {/* Screen-Space UI-Themed Maroon Measurement Badge */}
            <Html position={[0, containerSize.y / 2, 0]} center zIndexRange={[0, 10]} style={{ pointerEvents: "none" }}>
              <div style={styles.maroonBadge}>
                <span style={styles.arrowIcon}>⇕</span>
                <span style={styles.axisTitle}>Length:</span>
                <span style={styles.axisValue}>{dims.lengthCm} cm</span>
              </div>
            </Html>
          </group>
        </group>
      )}
    </group>
  );
}

const styles: Record<string, React.CSSProperties> = {
  maroonBadge: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif",
    fontSize: "12px",
    fontWeight: 700,
    color: "#f8fafc",
    background: "rgba(15, 23, 42, 0.94)",
    border: "1.5px solid #991b1b",
    borderRadius: "6px",
    padding: "4px 9px",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 14px rgba(153, 27, 27, 0.4), 0 2px 6px rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    gap: 5,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.15s ease",
  },
  arrowIcon: {
    color: "#fca5a5",
    fontSize: "12px",
    fontWeight: 800,
  },
  axisTitle: {
    color: "#fda4af",
    fontWeight: 600,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  axisValue: {
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "12px",
  },
};
