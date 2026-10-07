"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Placement } from "../lib/types";
import {
  colourForItem,
  cornerToCenter,
  dimensionToVector,
  positionToVector,
} from "../lib/utils";

interface BoxProps {
  placement: Placement;
  order: number;
  selected: boolean;
  onSelect: (itemCode: string | null) => void;
  isNewlyPlaced?: boolean;
  containerHeight?: number;
  containerSize?: THREE.Vector3;
}

export function Box({
  placement,
  order,
  selected,
  onSelect,
  isNewlyPlaced = false,
  containerHeight = 4.5,
  containerSize,
}: BoxProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const size = useMemo(
    () => dimensionToVector(placement.placedDimension),
    [placement.placedDimension]
  );
  const corner = useMemo(() => positionToVector(placement.position), [placement.position]);
  const center = useMemo(() => cornerToCenter(corner, size), [corner, size]);
  const colour = useMemo(() => colourForItem(placement.itemCode), [placement.itemCode]);
  const edges = useMemo(() => new THREE.BoxGeometry(size.x, size.y, size.z), [size]);

  const [hovered, setHovered] = useState(false);

  // Screen-space consistent typography (uniform visual size across all cartons and camera distances)
  const minSpan = Math.min(size.x, size.z);
  const isCompactPackage = minSpan < 1.8;
  const showSubDetails = !isCompactPackage || selected || hovered;

  // Animation state
  const isAnimatingRef = useRef(false);
  const dropHeight = useMemo(() => Math.max(containerHeight + 1.2, center.y + 1.8), [containerHeight, center.y]);

  useEffect(() => {
    if (isNewlyPlaced && groupRef.current) {
      // Start package above the container
      groupRef.current.position.set(center.x, dropHeight, center.z);
      groupRef.current.rotation.set(0.08, 0.05, 0);
      groupRef.current.scale.set(0.92, 0.92, 0.92);
      isAnimatingRef.current = true;
    } else if (groupRef.current) {
      // Set directly at resting location
      groupRef.current.position.copy(center);
      groupRef.current.rotation.set(0, 0, 0);
      groupRef.current.scale.set(1, 1, 1);
      isAnimatingRef.current = false;
    }
  }, [isNewlyPlaced, center, dropHeight]);

  // Frame animation loop using Three.js dampening
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isAnimatingRef.current) {
      const pos = groupRef.current.position;
      const rot = groupRef.current.rotation;
      const scale = groupRef.current.scale;

      // Smoothly damp position Y towards center.y
      pos.y = THREE.MathUtils.damp(pos.y, center.y, 8.5, delta);
      rot.x = THREE.MathUtils.damp(rot.x, 0, 9, delta);
      rot.y = THREE.MathUtils.damp(rot.y, 0, 9, delta);
      scale.x = THREE.MathUtils.damp(scale.x, 1, 8.5, delta);
      scale.y = THREE.MathUtils.damp(scale.y, 1, 8.5, delta);
      scale.z = THREE.MathUtils.damp(scale.z, 1, 8.5, delta);

      // Check if settled
      if (Math.abs(pos.y - center.y) < 0.003) {
        pos.copy(center);
        rot.set(0, 0, 0);
        scale.set(1, 1, 1);
        isAnimatingRef.current = false;
      }
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(selected ? null : placement.itemCode);
  };

  const lCm = (placement.placedDimension.length / 10).toFixed(0);
  const wCm = (placement.placedDimension.width / 10).toFixed(0);
  const hCm = (placement.placedDimension.depth / 10).toFixed(0);

  return (
    <group ref={groupRef} position={center}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[size.x, size.y, size.z]} />
        <meshStandardMaterial
          color={colour}
          transparent
          opacity={selected ? 0.96 : hovered ? 0.9 : 0.82}
          emissive={selected ? "#ffffff" : hovered ? colour : "#000000"}
          emissiveIntensity={selected ? 0.35 : hovered ? 0.18 : 0}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Edge wireframe */}
      <lineSegments geometry={new THREE.EdgesGeometry(edges)}>
        <lineBasicMaterial
          color={selected ? "#ffffff" : hovered ? "#f8fafc" : "#1e293b"}
          linewidth={selected ? 2.5 : 1}
        />
      </lineSegments>

      {/* Screen-Space Consistent 3D Label */}
      <Html center zIndexRange={[0, 10]} style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: "#ffffff",
            background: selected
              ? "rgba(15, 23, 42, 0.96)"
              : "rgba(17, 24, 39, 0.88)",
            border: selected
              ? "2px solid #38bdf8"
              : "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "6px",
            padding: "4px 9px",
            whiteSpace: "nowrap",
            maxWidth: "180px",
            boxShadow: selected
              ? "0 0 16px rgba(56, 189, 248, 0.6)"
              : "0 4px 10px rgba(0,0,0,0.35)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            transition: "all 0.15s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5, maxWidth: "100%" }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: colour,
                boxShadow: `0 0 6px ${colour}`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              #{order} {placement.itemCode}
            </span>
          </div>

          {showSubDetails && (
            <div
              style={{
                fontSize: "10px",
                color: "#cbd5e1",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100%",
              }}
            >
              {lCm} × {wCm} × {hCm} cm · {placement.weight ?? 1} kg
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
