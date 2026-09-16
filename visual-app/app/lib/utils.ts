import * as THREE from "three";
import type {
  Dimension3D,
  Placement,
  Position3D,
  PackingOrderPayload,
  UsedBox,
} from "./types";

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

export function resolveContainerSize(usedBox?: UsedBox): THREE.Vector3 {
  if (!usedBox || !usedBox.dimension) {
    return new THREE.Vector3(400, 400, 400).multiplyScalar(MM_TO_UNITS);
  }
  return dimensionToVector(usedBox.dimension);
}

const toMm = (value: number, unit?: string) => (unit === "cm" ? value * 10 : value);

export function convertOrderPayloadToOptimisationResult(payload: PackingOrderPayload) {
  if (!Array.isArray(payload.packedContainers) || !Array.isArray(payload.items) || !Array.isArray(payload.containers)) {
    return null;
  }

  const itemById = new Map(payload.items.map((item) => [item.id, item]));
  const containerById = new Map(payload.containers.map((container) => [container.id, container]));

  const placements = payload.packedContainers.flatMap((packedContainer, boxIndex) => {
    const container = packedContainer.containerId ? containerById.get(packedContainer.containerId) : undefined;

    return (packedContainer.placements ?? []).flatMap((placement) => {
      const item = itemById.get(placement.itemId);
      if (!item?.dimensions) {
        return [];
      }

      return [{
        boxInstance: boxIndex + 1,
        boxReference: container?.name ?? container?.id ?? `Carton ${boxIndex + 1}`,
        itemCode: item.name ?? item.id,
        placedDimension: {
          length: toMm(item.dimensions.length, item.dimensions.unit),
          width: toMm(item.dimensions.width, item.dimensions.unit),
          depth: toMm(item.dimensions.height, item.dimensions.unit),
        },
        position: {
          x: toMm(placement.position.x, placement.position.unit),
          y: toMm(placement.position.y, placement.position.unit),
          z: toMm(placement.position.z, placement.position.unit),
        },
      }];
    });
  });

  const usedBoxes = payload.packedContainers.flatMap((packedContainer, boxIndex) => {
    const container = packedContainer.containerId ? containerById.get(packedContainer.containerId) : undefined;
    if (!container?.dimensions) {
      return [];
    }

    const totalWeight = (packedContainer.placements ?? []).reduce((sum, placement) => {
      const item = itemById.get(placement.itemId);
      return sum + (item?.weight?.value ?? 0);
    }, 0);

    return [{
      boxInstance: boxIndex + 1,
      boxReference: container?.name ?? container?.id ?? `Carton ${boxIndex + 1}`,
      totalWeight,
      dimension: {
        length: toMm(container.dimensions.length, container.dimensions.unit),
        width: toMm(container.dimensions.width, container.dimensions.unit),
        depth: toMm(container.dimensions.height, container.dimensions.unit),
      },
    }];
  });

  return {
    placements,
    usedBoxes,
    unplacedItems: payload.unpackedItems ?? [],
  };
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
