"use client";

import { useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

    // Create a copy of canvas with white background
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvasRef.current, 0, 0);

    // Convert to blob
    const blob: Blob | null = await new Promise((resolve) =>
      tempCanvas.toBlob((b) => resolve(b), "image/png")
    );

    if (!blob) return;

    const formData = new FormData();
    formData.append("file", new File([blob], "digit.png", { type: "image/png" }));

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

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Draw a number</h1>
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="border border-gray-400 bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="flex space-x-4 mt-4">
        <button
          onClick={predict}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Predict
        </button>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear
        </button>
      </div>
      {prediction && (
        <pre className="mt-6 p-4 bg-gray-100 rounded w-full max-w-md overflow-x-auto text-sm text-black">
          {JSON.stringify(prediction, null, 2)}
        </pre>
      )}
    </main>
  );
}
