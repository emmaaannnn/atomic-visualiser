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