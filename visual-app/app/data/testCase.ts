import type { PackingOrderPayload } from "../lib/types";

export const testCaseOrderPayload: PackingOrderPayload = {
  orderId: "979ea41b-cf7a-4e9b-9b88-f86a875bd646",
  packedContainers: [
    {
      placements: [
        {
          itemId: "3f8ab01f-f66e-4039-a050-072ee3bb7849",
          position: { x: 0, y: 0, z: 0, unit: "cm" },
          rotation: { x: 0, y: 0, z: 0 },
        },
        {
          itemId: "62d1ff5c-b992-4482-a286-ea2b39bd2c6a",
          position: { x: 40, y: 0, z: 0, unit: "cm" },
          rotation: { x: 0, y: 0, z: 0 },
        },
        {
          itemId: "fdcd5ea6-704e-4176-abd6-39333d1f2a82",
          position: { x: 40, y: 50, z: 0, unit: "cm" },
          rotation: { x: 0, y: 0, z: 0 },
        },
      ],
      containerId: "2f6f98dc-46a1-44fa-89b3-ceb86a860dd4",
      utilisation: 0.21708333333333332,
    },
  ],
  unpackedItems: [],
  items: [
    {
      id: "3f8ab01f-f66e-4039-a050-072ee3bb7849",
      name: "27in monitor",
      dimensions: { length: 65, width: 40, height: 12, unit: "cm" },
      weight: { value: 5.5, unit: "kg" },
      quantity: 1,
    },
    {
      id: "62d1ff5c-b992-4482-a286-ea2b39bd2c6a",
      name: "Monitor arm",
      dimensions: { length: 50, width: 15, height: 8, unit: "cm" },
      weight: { value: 3, unit: "kg" },
      quantity: 1,
    },
    {
      id: "fdcd5ea6-704e-4176-abd6-39333d1f2a82",
      name: "VESA bracket",
      dimensions: { length: 25, width: 25, height: 3, unit: "cm" },
      weight: { value: 0.8, unit: "kg" },
      quantity: 1,
    },
  ],
  containers: [
    {
      id: "2f6f98dc-46a1-44fa-89b3-ceb86a860dd4",
      name: "XL carton",
      dimensions: { length: 80, width: 50, height: 45, unit: "cm" },
      maxWeight: { value: 40, unit: "kg" },
    },
  ],
  external_ref: "ORD-1053",
  status: "solved",
  created_at: "2026-09-09T01:46:35.401778+00:00",
};

export const multiCartonOrderPayload: PackingOrderPayload = {
  orderId: "c28b4911-39bc-4b32-8419-f90b91e92d81",
  packedContainers: [
    {
      containerId: "carton-xl-1",
      utilisation: 0.384,
      placements: [
        {
          itemId: "item-pc-tower",
          position: { x: 0, y: 0, z: 0, unit: "cm" },
        },
        {
          itemId: "item-ultrawide",
          position: { x: 26, y: 0, z: 0, unit: "cm" },
        },
        {
          itemId: "item-subwoofer",
          position: { x: 0, y: 52, z: 0, unit: "cm" },
        },
      ],
    },
    {
      containerId: "carton-med-2",
      utilisation: 0.465,
      placements: [
        {
          itemId: "item-keyboard",
          position: { x: 0, y: 0, z: 0, unit: "cm" },
        },
        {
          itemId: "item-docking-station",
          position: { x: 20, y: 0, z: 0, unit: "cm" },
        },
        {
          itemId: "item-cables-box",
          position: { x: 0, y: 30, z: 0, unit: "cm" },
        },
      ],
    },
  ],
  unpackedItems: [],
  items: [
    {
      id: "item-pc-tower",
      name: "Workstation Tower",
      dimensions: { length: 50, width: 24, height: 45, unit: "cm" },
      weight: { value: 11.2, unit: "kg" },
    },
    {
      id: "item-ultrawide",
      name: "34in Curved Display",
      dimensions: { length: 80, width: 22, height: 38, unit: "cm" },
      weight: { value: 8.5, unit: "kg" },
    },
    {
      id: "item-subwoofer",
      name: "Studio Subwoofer",
      dimensions: { length: 28, width: 25, height: 26, unit: "cm" },
      weight: { value: 4.8, unit: "kg" },
    },
    {
      id: "item-keyboard",
      name: "Mechanical Keyboard",
      dimensions: { length: 45, width: 18, height: 5, unit: "cm" },
      weight: { value: 1.4, unit: "kg" },
    },
    {
      id: "item-docking-station",
      name: "Thunderbolt 4 Dock",
      dimensions: { length: 22, width: 12, height: 6, unit: "cm" },
      weight: { value: 0.9, unit: "kg" },
    },
    {
      id: "item-cables-box",
      name: "Braided Power Pack",
      dimensions: { length: 25, width: 20, height: 10, unit: "cm" },
      weight: { value: 1.1, unit: "kg" },
    },
  ],
  containers: [
    {
      id: "carton-xl-1",
      name: "Industrial XL Crate",
      dimensions: { length: 90, width: 55, height: 50, unit: "cm" },
      maxWeight: { value: 50, unit: "kg" },
    },
    {
      id: "carton-med-2",
      name: "Standard Medium Box",
      dimensions: { length: 50, width: 35, height: 30, unit: "cm" },
      maxWeight: { value: 20, unit: "kg" },
    },
  ],
  external_ref: "ORD-2088 (Multi-Box)",
  status: "solved",
  created_at: "2026-10-01T08:12:00.000Z",
};

export const samplePresets = [
  { id: "test-case-1", label: "Workstation Setup (1 XL Carton)", payload: testCaseOrderPayload },
  { id: "test-case-2", label: "Multi-Carton Dispatch (2 Cartons)", payload: multiCartonOrderPayload },
];