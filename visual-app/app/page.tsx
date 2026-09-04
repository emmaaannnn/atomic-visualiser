"use client";

import dynamic from "next/dynamic";
import { mockPackingResult } from "./data/mockData";

const Visualizer3D = dynamic(
  () => import("./components/Visualizer3D").then((m) => m.Visualizer3D),
  { ssr: false }
);

export default function VisualizerPage() {
  return (
    <main style={{ width: "100vw", height: "100dvh" }}>
      <Visualizer3D result={mockPackingResult} />
    </main>
  );
}
