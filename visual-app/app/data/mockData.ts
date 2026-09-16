import type { OptimisationResult } from "../lib/types";

// Mock data task assigned to another engineer.
// COMPLETE HERE <NAME>
// Minimal placeholder result so the app can render while the data owner completes this.
// Case 1
export const case1Input = {
  boxTypes: [
    { Reference: "SML", Width: 150, Length: 150, Depth: 150, MaxWeight: 8.5, BoxWeight: 0.5, Active: true, MaximumBoxes: 100 },
    { Reference: "MED", Width: 400, Length: 400, Depth: 400, MaxWeight: 15.2, BoxWeight: 0.75, Active: true },
  ],
  items: [
    { ItemCode: "ITM-001", ItemReference: "Widget A", Width: 100, Length: 200, Depth: 50, Weight: 1, BoxGroup: "GROUP-A" },
    { ItemCode: "ITM-002", ItemReference: "Widget B", Width: 300, Length: 150, Depth: 75, Weight: 2.8 },
  ],
};

export const case1Output: OptimisationResult = {
  placements: [
    {
      boxInstance: 1,
      boxReference: "MED",
      itemCode: "ITM-002",
      placedDimension: { width: 300, length: 75, depth: 150 },
      position: { x: 0, y: 0, z: 0 },
    },
    {
      boxInstance: 1,
      boxReference: "MED",
      itemCode: "ITM-001",
      placedDimension: { width: 100, length: 50, depth: 200 },
      position: { x: 300, y: 0, z: 0 },
    },
  ],
  unplacedItems: [],
  usedBoxes: [
    {
      boxInstance: 1,
      boxReference: "MED",
      totalWeight: 3.8,
      dimension: { width: 400, length: 400, depth: 400 },
    },
  ],
};

export const mockPackingResult = case1Output;

// Case 2: Multi-item configuration utilizing both small and medium boxes
export const case2Input = {
  boxTypes: [
    { Reference: "SML", Width: 150, Length: 150, Depth: 150, MaxWeight: 8.5, BoxWeight: 0.5, Active: true, MaximumBoxes: 100 },
    { Reference: "MED", Width: 400, Length: 400, Depth: 400, MaxWeight: 15.2, BoxWeight: 0.75, Active: true },
  ],
  items: [
    { ItemCode: "ITM-003", ItemReference: "Small Component", Width: 100, Length: 100, Depth: 100, Weight: 1.5 },
    { ItemCode: "ITM-004", ItemReference: "Flat Panel", Width: 120, Length: 120, Depth: 20, Weight: 0.8 },
  ],
};

export const case2Output: OptimisationResult = {
  placements: [
    {
      boxInstance: 1,
      boxReference: "SML",
      itemCode: "ITM-003",
      placedDimension: { width: 100, length: 100, depth: 100 },
      position: { x: 0, y: 0, z: 0 },
    },
    {
      boxInstance: 1,
      boxReference: "SML",
      itemCode: "ITM-004",
      placedDimension: { width: 120, length: 20, depth: 120 },
      position: { x: 0, y: 100, z: 0 },
    },
  ],
  unplacedItems: [],
  usedBoxes: [
    {
      boxInstance: 1,
      boxReference: "SML",
      totalWeight: 2.3,
      dimension: { width: 150, length: 150, depth: 150 },
    },
  ],
};

// Case 3: Edge-case with heavy item testing weight limits
export const case3Input = {
  boxTypes: [
    { Reference: "SML", Width: 150, Length: 150, Depth: 150, MaxWeight: 2.0, BoxWeight: 0.5, Active: true, MaximumBoxes: 100 },
  ],
  items: [
    { ItemCode: "ITM-005", ItemReference: "Heavy Iron Block", Width: 100, Length: 100, Depth: 100, Weight: 5.0 },
  ],
};

export const case3Output = {
  placements: [],
  unplacedItems: [
    { ItemCode: "ITM-005", Reason: "Exceeds max weight capacity" },
  ],
  usedBoxes: [],
};

export type MockCaseId = "case1" | "case2" | "case3";

export const mockCases = {
  case1: {
    label: "Case 1",
    description: "Two items packed into one medium carton.",
    input: case1Input,
    output: case1Output,
  },
  case2: {
    label: "Case 2",
    description: "A compact packing example using the small carton.",
    input: case2Input,
    output: case2Output,
  },
  case3: {
    label: "Case 3",
    description: "A weight-limit failure with no valid placement.",
    input: case3Input,
    output: case3Output as OptimisationResult,
  },
} as const;

export const mockCaseOrder: MockCaseId[] = ["case1", "case2", "case3"];