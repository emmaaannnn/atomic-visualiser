"use client";

import dynamic from "next/dynamic";
import { mockPackingResult } from "../AtomicVisualizer/mockData";

const AtomicVisualizer = dynamic(
  () => import("../AtomicVisualizer/AtomicVisualizer").then((m) => m.AtomicVisualizer),
  { ssr: false }
);

export default function VisualizerPage() {
  return (
    <main style={{ width: "100vw", height: "100dvh" }}>
      <AtomicVisualizer result={mockPackingResult} />
    </main>
  );
}
