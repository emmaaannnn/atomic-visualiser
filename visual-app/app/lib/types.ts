
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

export interface OptimisationResult {
  placements: Placement[];
  unplacedItems: unknown[];
  usedBoxes: UsedBox[];
}
