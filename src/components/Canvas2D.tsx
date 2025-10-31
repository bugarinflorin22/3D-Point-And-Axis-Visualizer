import { useRef, useEffect, useState } from 'react';
import { Point2D } from '../types/geometry';

interface Canvas2DProps {
  point: Point2D;
  onPointChange: (point: Point2D) => void;
  axisLabels?: { x: string; y: string };
  canvasSize?: number;
  scale?: number;
  onCanvasSizeChange?: (size: number) => void;
  onScaleChange?: (scale: number) => void;
  showCircle?: boolean;
  showRadius?: boolean;
  showAngles?: boolean;
}

export function Canvas2D({
  point,
  onPointChange,
  axisLabels = { x: 'X', y: 'Y' }, canvasSize = 600, scale = 50, onCanvasSizeChange, onScaleChange, showCircle = false, showRadius = false, showAngles = false
}: Canvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const gridSize = 10;

  const toCanvas = (x: number, y: number, width: number, height: number): Point2D => ({
    x: width / 2 + x * scale,
    y: height / 2 - y * scale
  });

  const fromCanvas = (x: number, y: number, width: number, height: number): Point2D => ({
    x: (x - width / 2) / scale,
    y: -(y - height / 2) / scale
  });

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  // set physical pixel size for crisp rendering on high-DPI displays
  canvas.width = Math.round(canvasSize * dpr);
  canvas.height = Math.round(canvasSize * dpr);
  // keep CSS size in layout
  canvas.style.width = `${canvasSize}px`;
  canvas.style.height = `${canvasSize}px`;
  // scale drawing so 1 unit = 1 CSS pixel
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = canvasSize;
  const height = canvasSize;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = -gridSize; i <= gridSize; i++) {
      const pos = toCanvas(i, 0, width, height);
      ctx.beginPath();
      ctx.moveTo(pos.x, 0);
      ctx.lineTo(pos.x, height);
      ctx.stroke();

      const posY = toCanvas(0, i, width, height);
      ctx.beginPath();
      ctx.moveTo(0, posY.y);
      ctx.lineTo(width, posY.y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

  ctx.fillStyle = '#3b82f6';
  ctx.font = '14px sans-serif';
  ctx.fillText(axisLabels.x, width - 20, height / 2 - 10);
  ctx.fillText(axisLabels.y, width / 2 + 10, 20);

    // Radius and angle visualization
    if (showCircle || showRadius || showAngles) {
      const radius = Math.sqrt(point.x * point.x + point.y * point.y);
      let theta = Math.atan2(point.y, point.x);
      const center = toCanvas(0, 0, width, height);
      const color = '#10b981';
      const fillColor = 'rgba(16, 185, 129, 0.1)';

      // Draw circle
      if (showCircle) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius * scale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = fillColor;
        ctx.fill();
      }

      const canvasPointTemp = toCanvas(point.x, point.y, width, height);

      // Draw radius line and label
      if (showRadius) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(canvasPointTemp.x, canvasPointTemp.y);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = '11px sans-serif';
        ctx.fillText(`r=${radius.toFixed(2)}`, (center.x + canvasPointTemp.x) / 2 - 10, (center.y + canvasPointTemp.y) / 2 - 5);
      }

      // Draw angle arc and label
      if (showAngles) {
        const arcRadius = 30;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(center.x, center.y, arcRadius, 0, -theta, true);
        ctx.stroke();

        const arrowX = center.x + arcRadius * Math.cos(theta);
        const arrowY = center.y - arcRadius * Math.sin(theta);
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(
          arrowX - 5 * Math.cos(theta + 0.3),
          arrowY + 5 * Math.sin(theta + 0.3)
        );
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.fillText(
          `θ=${((theta * 180) / Math.PI).toFixed(1)}°`,
          center.x + arcRadius + 10,
          center.y - 10
        );
      }
    }

    const canvasPoint = toCanvas(point.x, point.y, width, height);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(canvasPoint.x, canvasPoint.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvasPoint.x, canvasPoint.y);
    ctx.lineTo(canvasPoint.x, height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvasPoint.x, canvasPoint.y);
    ctx.lineTo(width / 2, canvasPoint.y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#1f2937';
    ctx.font = '12px monospace';
    ctx.fillText(
      `(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`,
      canvasPoint.x + 12,
      canvasPoint.y - 12
    );
  }, [point, axisLabels, scale, canvasSize, showCircle, showRadius, showAngles]);


  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const canvasPoint = toCanvas(point.x, point.y, rect.width, rect.height);
    const distance = Math.sqrt(
      Math.pow(mouseX - canvasPoint.x, 2) + Math.pow(mouseY - canvasPoint.y, 2)
    );

    if (distance < 15) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newPoint = fromCanvas(mouseX, mouseY, rect.width, rect.height);
    onPointChange(newPoint);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="border border-gray-300 rounded-lg cursor-pointer bg-white w-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Canvas Size</label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onCanvasSizeChange && onCanvasSizeChange(Math.max(300, canvasSize - 50))}
              className="px-1.5 py-0.5 text-xs bg-blue-100 hover:bg-blue-200 rounded font-semibold"
            >
              -
            </button>
            <input
              type="range"
              min={300}
              max={1200}
              step={50}
              value={canvasSize}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                const snapped = Math.round(v / 50) * 50;
                onCanvasSizeChange && onCanvasSizeChange(snapped);
              }}
              className="flex-1 h-1.5"
            />
            <button
              onClick={() => onCanvasSizeChange && onCanvasSizeChange(Math.min(1200, canvasSize + 50))}
              className="px-1.5 py-0.5 text-xs bg-blue-100 hover:bg-blue-200 rounded font-semibold"
            >
              +
            </button>
            <span className="text-xs text-gray-600 min-w-max">{canvasSize}px</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">2D Zoom</label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onScaleChange && onScaleChange(Math.max(10, scale - 5))}
              className="px-1.5 py-0.5 text-xs bg-blue-100 hover:bg-blue-200 rounded font-semibold"
            >
              -
            </button>
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={scale}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                onScaleChange && onScaleChange(v);
              }}
              className="flex-1 h-1.5"
            />
            <button
              onClick={() => onScaleChange && onScaleChange(Math.min(120, scale + 5))}
              className="px-1.5 py-0.5 text-xs bg-blue-100 hover:bg-blue-200 rounded font-semibold"
            >
              +
            </button>
            <span className="text-xs text-gray-600 min-w-max">{scale}px/u</span>
          </div>
        </div>
      </div>
    </div>
  );
}
