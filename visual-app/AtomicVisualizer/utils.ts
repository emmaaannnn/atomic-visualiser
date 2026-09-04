import * as THREE from "three";
import type { Dimension3D, Placement, Position3D, UsedBox } from "./types";

export const MM_TO_UNITS = 0.01;


export function dimensionToVector(d: Dimension3D): THREE.Vector3 {
  return new THREE.Vector3(d.width, d.depth, d.length).multiplyScalar(MM_TO_UNITS);
}

export function positionToVector(p: Position3D): THREE.Vector3 {
  return new THREE.Vector3(p.x, p.y, p.z).multiplyScalar(MM_TO_UNITS);
}

export function cornerToCenter(position: THREE.Vector3, size: THREE.Vector3): THREE.Vector3 {
  return position.clone().add(size.clone().multiplyScalar(0.5));
}

export function groupByBoxInstance(placements: Placement[]): Map<number, Placement[]> {
  const groups = new Map<number, Placement[]>();
  for (const p of placements) {
    const list = groups.get(p.boxInstance) ?? [];
    list.push(p);
    groups.set(p.boxInstance, list);
  }
  return groups;
}

export function resolveContainerSize(usedBox: UsedBox): THREE.Vector3 {
  return dimensionToVector(usedBox.dimension);
}

const PALETTE = [
  "#3B82C4", "#E0793C", "#4F9D6E", "#B25D9C",
  "#D6B03C", "#010409", "#C4523E", "#00fef1",
];

export function colourForItem(itemCode: string): string {
  let hash = 0;
  for (let i = 0; i < itemCode.length; i++) {
    hash = (hash * 31 + itemCode.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}