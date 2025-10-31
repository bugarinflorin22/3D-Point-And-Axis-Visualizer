import { useRef, useEffect, useState } from 'react';
import { Point3D, Point2D, Camera3D, PerspectivePreset, ShapePreset, PERSPECTIVE_PRESETS } from '../types/geometry';
import { project3DTo2D, generateCylinderPoints, generateSpherePoints } from '../utils/projection';
import { normalizeTheta } from '../utils/coordinates';

interface Canvas3DProps {
  point: Point3D;
  onPointChange: (point: Point3D) => void;
  perspectivePreset: PerspectivePreset;
  shapePreset?: ShapePreset;
  axisLabels?: { x: string; y: string; z: string };
  canvasSize?: number;
  cameraDistance?: number;
  onCameraDistanceChange?: (n: number) => void;
  onCanvasSizeChange?: (size: number) => void;
  showCircle?: boolean;
  showRadius?: boolean;
  showAngles?: boolean;
}

export function Canvas3D({
  point,
  onPointChange,
  perspectivePreset,
  shapePreset = 'none',
  axisLabels = { x: 'X', y: 'Y', z: 'Z' },
  canvasSize = 600,
  cameraDistance,
  onCameraDistanceChange,
  onCanvasSizeChange,
  showCircle = false,
  showRadius = false,
  showAngles = false
}: Canvas3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [camera, setCamera] = useState<Camera3D>({
    angleX: 0.5,
    angleY: 0.8,
    distance: 10
  });
  const [isRotating, setIsRotating] = useState(false);
  const [lastMouse, setLastMouse] = useState<Point2D>({ x: 0, y: 0 });

  useEffect(() => {
    const preset = PERSPECTIVE_PRESETS[perspectivePreset];
    setCamera({
      angleX: preset.angleX,
      angleY: preset.angleY,
      distance: preset.distance
    });
  }, [perspectivePreset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    // set backing store size for high-DPI
    canvas.width = Math.round(canvasSize * dpr);
    canvas.height = Math.round(canvasSize * dpr);
    // keep CSS size for layout and mouse coordinates
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = canvasSize;
    const height = canvasSize;

    ctx.clearRect(0, 0, width, height);

    const drawLine = (from: Point3D, to: Point3D, color: string, lineWidth = 1) => {
      const p1 = project3DTo2D(from, camera, width, height);
      const p2 = project3DTo2D(to, camera, width, height);

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    };

    const gridSize = 5;
    ctx.strokeStyle = '#e5e7eb';
    for (let i = -gridSize; i <= gridSize; i++) {
      drawLine({ x: i, y: -gridSize, z: 0 }, { x: i, y: gridSize, z: 0 }, '#e5e7eb');
      drawLine({ x: -gridSize, y: i, z: 0 }, { x: gridSize, y: i, z: 0 }, '#e5e7eb');
    }

    drawLine({ x: 0, y: 0, z: 0 }, { x: 5, y: 0, z: 0 }, '#ef4444', 3);
    drawLine({ x: 0, y: 0, z: 0 }, { x: 0, y: 5, z: 0 }, '#10b981', 3);
    drawLine({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 5 }, '#3b82f6', 3);

    const xLabel = project3DTo2D({ x: 5.5, y: 0, z: 0 }, camera, width, height);
    const yLabel = project3DTo2D({ x: 0, y: 5.5, z: 0 }, camera, width, height);
    const zLabel = project3DTo2D({ x: 0, y: 0, z: 5.5 }, camera, width, height);

  ctx.fillStyle = '#ef4444';
  ctx.font = '14px sans-serif';
  ctx.fillText(axisLabels.x, xLabel.x, xLabel.y);
  ctx.fillStyle = '#10b981';
  ctx.fillText(axisLabels.y, yLabel.x, yLabel.y);
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(axisLabels.z, zLabel.x, zLabel.y);

    // Radius and angle visualization
    if (showCircle || showRadius || showAngles) {
      const scale = 50;
      const cylinderRadius = Math.sqrt(point.x * point.x + point.y * point.y);
      const cylinderHeight = Math.abs(point.z);
      const sphereRadius = Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z);
      let theta = Math.atan2(point.y, point.x);
      theta = normalizeTheta(theta, '0-360');
      const phi = sphereRadius > 0 ? Math.acos(point.z / sphereRadius) : 0;

      // Draw cylinder visualization
      if (showCircle && shapePreset === 'cylinder') {
        const zStart = point.z >= 0 ? 0 : point.z;
        const actualHeight = point.z >= 0 ? point.z : -point.z;
        const cylinderPoints = generateCylinderPoints(cylinderRadius, actualHeight, 32, zStart);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1;

        for (let i = 0; i < cylinderPoints.length - 2; i += 2) {
          const p1 = project3DTo2D(cylinderPoints[i], camera, width, height);
          const p2 = project3DTo2D(cylinderPoints[i + 2], camera, width, height);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          const p3 = project3DTo2D(cylinderPoints[i + 1], camera, width, height);
          const p4 = project3DTo2D(cylinderPoints[i + 3], camera, width, height);
          ctx.beginPath();
          ctx.moveTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.stroke();
        }
      }

      // Draw sphere visualization
      if (showCircle && shapePreset === 'sphere') {
        const spherePoints = generateSpherePoints(sphereRadius, 16);
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 1;

        const segments = 16;
        for (let i = 0; i <= segments; i++) {
          for (let j = 0; j < segments; j++) {
            const idx1 = i * (segments + 1) + j;
            const idx2 = i * (segments + 1) + j + 1;

            if (idx1 < spherePoints.length && idx2 < spherePoints.length) {
              const p1 = project3DTo2D(spherePoints[idx1], camera, width, height);
              const p2 = project3DTo2D(spherePoints[idx2], camera, width, height);
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        for (let j = 0; j <= segments; j++) {
          for (let i = 0; i < segments; i++) {
            const idx1 = i * (segments + 1) + j;
            const idx2 = (i + 1) * (segments + 1) + j;

            if (idx1 < spherePoints.length && idx2 < spherePoints.length) {
              const p1 = project3DTo2D(spherePoints[idx1], camera, width, height);
              const p2 = project3DTo2D(spherePoints[idx2], camera, width, height);
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw radius - for cylinder
      if (showRadius && shapePreset === 'cylinder') {
        const originProj = project3DTo2D({ x: 0, y: 0, z: 0 }, camera, width, height);
        const radiusPoint = project3DTo2D({ x: cylinderRadius, y: 0, z: 0 }, camera, width, height);
        ctx.strokeStyle = '#10b981';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(originProj.x, originProj.y);
        ctx.lineTo(radiusPoint.x, radiusPoint.y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#10b981';
        ctx.font = '11px sans-serif';
        ctx.fillText(`r=${cylinderRadius.toFixed(2)}`, (originProj.x + radiusPoint.x) / 2, originProj.y - 5);

        const topPoint = project3DTo2D({ x: 0, y: 0, z: point.z }, camera, width, height);
        const bottomPoint = project3DTo2D({ x: 0, y: 0, z: 0 }, camera, width, height);
        ctx.strokeStyle = '#10b981';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(topPoint.x, topPoint.y);
        ctx.lineTo(bottomPoint.x, bottomPoint.y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#10b981';
        ctx.fillText(`h=${cylinderHeight.toFixed(2)}`, topPoint.x + 10, (topPoint.y + bottomPoint.y) / 2);
      }

      // Draw radius - for sphere
      if (showRadius && shapePreset === 'sphere') {
        const originProjSph = project3DTo2D({ x: 0, y: 0, z: 0 }, camera, width, height);
        const pointProj = project3DTo2D(point, camera, width, height);
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(originProjSph.x, originProjSph.y);
        ctx.lineTo(pointProj.x, pointProj.y);
        ctx.stroke();

        ctx.fillStyle = '#ea580c';
        ctx.font = '11px sans-serif';
        ctx.fillText(`ρ=${sphereRadius.toFixed(2)}`, (originProjSph.x + pointProj.x) / 2, (originProjSph.y + pointProj.y) / 2 - 5);
      }

      // Draw angles - for cylinder (only theta)
      if (showAngles && shapePreset === 'cylinder') {
        const thetaArcRadius = 40;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        for (let i = 0; i <= 20; i++) {
          const angle = (i / 20) * theta;
          const p1 = project3DTo2D(
            { x: thetaArcRadius / scale * Math.cos(angle), y: thetaArcRadius / scale * Math.sin(angle), z: 0 },
            camera,
            width,
            height
          );
          if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
          } else {
            ctx.lineTo(p1.x, p1.y);
          }
        }
        ctx.stroke();

        const thetaLabelPoint = project3DTo2D(
          { x: (thetaArcRadius / scale + 0.5) * Math.cos(theta / 2), y: (thetaArcRadius / scale + 0.5) * Math.sin(theta / 2), z: 0 },
          camera,
          width,
          height
        );
        ctx.fillStyle = '#10b981';
        ctx.font = '11px sans-serif';
        ctx.fillText(`θ=${((theta * 180) / Math.PI).toFixed(1)}°`, thetaLabelPoint.x, thetaLabelPoint.y);
      }

      // Draw angles - for sphere (theta and phi)
      if (showAngles && shapePreset === 'sphere') {
        const thetaArcRadiusSph = 40;
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 1.5;
        for (let i = 0; i <= 20; i++) {
          const angle = (i / 20) * theta;
          const p1 = project3DTo2D(
            { x: thetaArcRadiusSph / scale * Math.cos(angle), y: thetaArcRadiusSph / scale * Math.sin(angle), z: 0 },
            camera,
            width,
            height
          );
          if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
          } else {
            ctx.lineTo(p1.x, p1.y);
          }
        }
        ctx.stroke();

        const thetaLabelPointSph = project3DTo2D(
          { x: (thetaArcRadiusSph / scale + 0.5) * Math.cos(theta / 2), y: (thetaArcRadiusSph / scale + 0.5) * Math.sin(theta / 2), z: 0 },
          camera,
          width,
          height
        );
        ctx.fillStyle = '#ea580c';
        ctx.font = '11px sans-serif';
        ctx.fillText(`θ=${((theta * 180) / Math.PI).toFixed(1)}°`, thetaLabelPointSph.x, thetaLabelPointSph.y);

        const phiArcRadius = 40;
        const projectionRadius = Math.sqrt(point.x * point.x + point.y * point.y);
        const direction = projectionRadius > 0 ? { x: point.x / projectionRadius, y: point.y / projectionRadius, z: 0 } : { x: 1, y: 0, z: 0 };

        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 1.5;
        for (let i = 0; i <= 20; i++) {
          const angle = (i / 20) * phi;
          const p1 = project3DTo2D(
            {
              x: direction.x * (phiArcRadius / scale) * Math.sin(angle),
              y: direction.y * (phiArcRadius / scale) * Math.sin(angle),
              z: (phiArcRadius / scale) * Math.cos(angle)
            },
            camera,
            width,
            height
          );
          if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
          } else {
            ctx.lineTo(p1.x, p1.y);
          }
        }
        ctx.stroke();

        const phiLabelPoint = project3DTo2D(
          {
            x: direction.x * (phiArcRadius / scale + 0.5) * Math.sin(phi / 2),
            y: direction.y * (phiArcRadius / scale + 0.5) * Math.sin(phi / 2),
            z: (phiArcRadius / scale + 0.5) * Math.cos(phi / 2)
          },
          camera,
          width,
          height
        );
        ctx.fillStyle = '#ea580c';
        ctx.fillText(`φ=${((phi * 180) / Math.PI).toFixed(1)}°`, phiLabelPoint.x, phiLabelPoint.y);
      }
    }

    drawLine({ x: point.x, y: point.y, z: 0 }, point, '#ef4444', 1);
    ctx.setLineDash([5, 5]);
    drawLine({ x: point.x, y: point.y, z: 0 }, { x: point.x, y: 0, z: 0 }, '#9ca3af', 1);
    drawLine({ x: 0, y: point.y, z: 0 }, { x: point.x, y: point.y, z: 0 }, '#9ca3af', 1);
    ctx.setLineDash([]);

    const projectedPoint = project3DTo2D(point, camera, width, height);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(projectedPoint.x, projectedPoint.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1f2937';
    ctx.font = '12px monospace';
    ctx.fillText(
      `(${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`,
      projectedPoint.x + 12,
      projectedPoint.y - 12
    );
  }, [point, camera, axisLabels, showCircle, showRadius, showAngles, shapePreset]);

  // Sync camera distance when parent prop changes
  useEffect(() => {
    if (typeof cameraDistance === 'number') {
      setCamera((prev) => ({ ...prev, distance: cameraDistance }));
    }
  }, [cameraDistance]);


  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const projectedPoint = project3DTo2D(point, camera, rect.width, rect.height);
    const distance = Math.sqrt(
      Math.pow(mouseX - projectedPoint.x, 2) + Math.pow(mouseY - projectedPoint.y, 2)
    );

    if (distance < 15) {
      setIsDragging(true);
    } else {
      setIsRotating(true);
      setLastMouse({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging) {
  const deltaX = (mouseX - rect.width / 2) / 50;
  const deltaY = -(mouseY - rect.height / 2) / 50;

      onPointChange({
        x: deltaX,
        y: point.y,
        z: deltaY
      });
    } else if (isRotating && perspectivePreset === 'free') {
      const dx = mouseX - lastMouse.x;
      const dy = mouseY - lastMouse.y;

      setCamera(prev => ({
        ...prev,
        angleY: prev.angleY + dx * 0.01,
        angleX: Math.max(-Math.PI / 2, Math.min(Math.PI / 2, prev.angleX - dy * 0.01))
      }));

      setLastMouse({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsRotating(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setCamera(prev => {
      const newDistance = Math.max(5, Math.min(30, prev.distance + e.deltaY * 0.01));
      // notify parent if requested
      if (onCameraDistanceChange) onCameraDistanceChange(newDistance);
      return { ...prev, distance: newDistance };
    });
  };

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 rounded-lg cursor-pointer bg-white w-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-lg">
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
          <label className="block text-xs font-medium text-gray-700 mb-1">Camera Distance</label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const newDistance = Math.max(5, camera.distance - 1);
                setCamera(prev => ({ ...prev, distance: newDistance }));
                if (onCameraDistanceChange) onCameraDistanceChange(newDistance);
              }}
              className="px-1.5 py-0.5 text-xs bg-blue-100 hover:bg-blue-200 rounded font-semibold"
            >
              -
            </button>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={camera.distance}
              onChange={(e) => {
                const newDistance = parseInt(e.target.value);
                setCamera(prev => ({ ...prev, distance: newDistance }));
                if (onCameraDistanceChange) onCameraDistanceChange(newDistance);
              }}
              className="flex-1 h-1.5"
            />
            <button
              onClick={() => {
                const newDistance = Math.min(30, camera.distance + 1);
                setCamera(prev => ({ ...prev, distance: newDistance }));
                if (onCameraDistanceChange) onCameraDistanceChange(newDistance);
              }}
              className="px-1.5 py-0.5 text-xs bg-blue-100 hover:bg-blue-200 rounded font-semibold"
            >
              +
            </button>
            <span className="text-xs text-gray-600 min-w-max">{camera.distance.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
