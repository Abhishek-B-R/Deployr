import { Html, useProgress } from "@react-three/drei";

export default function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center className="flex flex-col items-center justify-center">
      <div className="w-48 h-6 border-2 border-neo-black bg-white p-1">
        <div
          className="h-full bg-neo-yellow"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="font-mono font-bold text-neo-black mt-2 text-sm bg-white px-2 py-1 border-2 border-neo-black shadow-neo-sm">
        LOADING_ASSETS... {progress.toFixed(0)}%
      </p>
    </Html>
  );
}
