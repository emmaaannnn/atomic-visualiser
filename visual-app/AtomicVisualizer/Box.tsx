"use client";

import { useMemo, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Placement } from "./types";
import { colourForItem, cornerToCenter, dimensionToVector, positionToVector } from "./utils";

interface BoxProps {
  placement: Placement;
  order: number;
  selected: boolean;
  onSelect: (itemCode: string | null) => void;
}

export function Box({ placement, order, selected, onSelect }: BoxProps) {
  const size = useMemo(() => dimensionToVector(placement.placedDimension), [placement.placedDimension]);
  const corner = useMemo(() => positionToVector(placement.position), [placement.position]);
  const center = useMemo(() => cornerToCenter(corner, size), [corner, size]);
  const colour = useMemo(() => colourForItem(placement.itemCode), [placement.itemCode]);
  const edges = useMemo(() => new THREE.BoxGeometry(size.x, size.y, size.z), [size]);
  const [hovered, setHovered] = useState(false);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(selected ? null : placement.itemCode);
  };

  return (
    <group position={center}>
      <mesh
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
          opacity={selected ? 0.95 : hovered ? 0.85 : 0.75}
          emissive={selected ? colour : "#000000"}
          emissiveIntensity={selected ? 0.35 : 0}
        />
      </mesh>

      <lineSegments geometry={new THREE.EdgesGeometry(edges)}>
        <lineBasicMaterial color={selected ? "#111111" : "#333333"} linewidth={selected ? 2 : 1} />
      </lineSegments>

      <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            color: "#ffffff",
            background: "rgba(17, 17, 17, 0.72)",
            borderRadius: "4px",
            padding: "2px 6px",
            whiteSpace: "nowrap",
          }}
        >
          {order}. {placement.itemCode}
        </div>
      </Html>
    </group>
  );
}
