"use client";

import { useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 🖱️ Mouse handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 15;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // 📱 Touch handlers
  const startTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // avoid scrolling
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 15;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const moveTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endTouch = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "white"; // reset to white
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    setPrediction(null);
  };

  const predict = async () => {
    if (!canvasRef.current) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;

    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvasRef.current, 0, 0);

    const blob: Blob | null = await new Promise((resolve) =>
      tempCanvas.toBlob((b) => resolve(b), "image/png")
    );

    if (!blob) return;

    const formData = new FormData();
    formData.append(
      "file",
      new File([blob], "digit.png", { type: "image/png" })
    );

    try {
      const res = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setPrediction(data);
    } catch (error) {
      console.error(error);
      setPrediction({ error: "Failed to fetch prediction" });
    }
  };

  // 🎨 Colors for 10 digits
  const COLORS = [
    "#6366f1",
    "#f97316",
    "#22c55e",
    "#ef4444",
    "#06b6d4",
    "#eab308",
    "#9333ea",
    "#f43f5e",
    "#0ea5e9",
    "#10b981",
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 p-8">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          ✏️ Draw a Number
        </h1>

        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="border-2 border-gray-300 rounded-lg shadow-md bg-white cursor-crosshair hover:shadow-lg transition"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startTouch}
          onTouchMove={moveTouch}
          onTouchEnd={endTouch}
        />

        <div className="flex space-x-4 mt-6">
          <button
            onClick={predict}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 hover:scale-105 transition transform"
          >
            🔮 Predict
          </button>
          <button
            onClick={clearCanvas}
            className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 hover:scale-105 transition transform"
          >
            🧹 Clear
          </button>
        </div>

        {prediction && (
          <div className="mt-10 w-full flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              ✅ Predicted Digit:{" "}
              <span className="text-indigo-600 text-3xl">
                {prediction.predicted_digit}
              </span>
            </h2>

            <div className="w-full h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={prediction.probs.map((p: number, i: number) => ({
                      name: `Digit ${i}`,
                      value: p,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name }) => name}
                  >
                    {prediction.probs.map((_: number, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
