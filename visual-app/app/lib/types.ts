
export interface Dimension3D {
  depth: number;
  length: number;
  width: number;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Placement {
  boxInstance: number;
  boxReference: string;
  itemCode: string;
  placedDimension: Dimension3D;
  position: Position3D;
}

export interface UsedBox {
  boxInstance: number;
  boxReference: string;
  totalWeight: number;
  dimension: Dimension3D;
}

export interface PackingPosition {
  x: number;
  y: number;
  z: number;
  unit?: string;
}

export interface PackingRotation {
  x: number;
  y: number;
  z: number;
}

export interface PackingItem {
  id: string;
  name?: string;
  dimensions?: { length: number; width: number; height: number; unit?: string };
  weight?: { value: number; unit?: string };
  quantity?: number;
}

export interface PackingContainer {
  id: string;
  name?: string;
  dimensions?: { length: number; width: number; height: number; unit?: string };
  maxWeight?: { value: number; unit?: string };
}

export interface PackingPlacement {
  itemId: string;
  position: PackingPosition;
  rotation?: PackingRotation;
}

export interface PackedContainer {
  containerId?: string;
  utilisation?: number;
  placements?: PackingPlacement[];
}

export interface UnpackedItem {
  id?: string;
  itemId?: string;
  reason?: string;
}

export interface PackingOrderPayload {
  orderId?: string;
  packedContainers?: PackedContainer[];
  unpackedItems?: UnpackedItem[];
  items?: PackingItem[];
  containers?: PackingContainer[];
  external_ref?: string;
  status?: string;
  created_at?: string;
}

export interface OptimisationResult {
  placements: Placement[];
  unplacedItems: unknown[];
  usedBoxes: UsedBox[];
}
