import type { OptimisationResult } from "../lib/types";

// Mock data task assigned to another engineer.
// COMPLETE HERE <NAME>
// Minimal placeholder result so the app can render while the data owner completes this.
export const mockPackingResult: OptimisationResult = {
  placements: [
    {
      boxInstance: 1,
      boxReference: "MED",
      itemCode: "BOX-001",
      placedDimension: { depth: 75, length: 150, width: 300 },
      position: { x: 0, y: 0, z: 0 },
    },
    {
      boxInstance: 1,
      boxReference: "MED",
      itemCode: "BOX-002",
      placedDimension: { depth: 50, length: 200, width: 100 },
      position: { x: 300, y: 0, z: 0 },
    },
    {
      boxInstance: 1,
      boxReference: "MED",
      itemCode: "BOX-003",
      placedDimension: { depth: 50, length: 150, width: 100 },
      position: { x: 400, y: 0, z: 0 },
    },
    {
      boxInstance: 1,
      boxReference: "MED",
      itemCode: "BOX-004",
      placedDimension: { depth: 50, length: 150, width: 100 },
      position: { x: 400, y: 50, z: 0 },
    },
    {
      boxInstance: 1,
      boxReference: "MED",
      itemCode: "BOX-005",
      placedDimension: { depth: 50, length: 150, width: 200 },
      position: { x: 500, y: 0, z: 0 },
    },
  ],
  unplacedItems: [],
  usedBoxes: [
    {
      boxInstance: 1,
      boxReference: "MED",
      totalWeight: 3.8,
      dimension: { depth: 90, length: 220, width: 420 },
    },
  ],
};

