import { useState, useEffect } from 'react';
import { Canvas2D } from './components/Canvas2D';
import { Canvas3D } from './components/Canvas3D';
import { Controls } from './components/Controls';
import { FormulaCard } from './components/FormulaCard';
import { CoordinateInputs } from './components/CoordinateInputs';
import { CoordinateDisplay } from './components/CoordinateDisplay';
import { ThetaRangeSettings, ThetaRange } from './components/ThetaRangeSettings';
import { AxisNameSettings } from './components/AxisNameSettings';
import { Point2D, Point3D, ViewMode, ShapePreset, PerspectivePreset, PolarCoords, CylindricalCoords, SphericalCoords } from './types/geometry';
import { cartesianToPolar, polarToCartesian, cartesianToCylindrical, cylindricalToCartesian, cartesianToSpherical, sphericalToCartesian } from './utils/coordinates';
import { Box } from 'lucide-react';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  const [point2D, setPoint2D] = useState<Point2D>({ x: 2, y: 3 });
  const [point3D, setPoint3D] = useState<Point3D>({ x: 2, y: 2, z: 1 });
  const [shapePreset, setShapePreset] = useState<ShapePreset>('none');
  const [perspectivePreset, setPerspectivePreset] = useState<PerspectivePreset>('free');
  const [thetaRange, setThetaRange] = useState<ThetaRange>('0-360');

  const [axis2DNames, setAxis2DNames] = useState<{ x: string; y: string }>({ x: 'X', y: 'Y' });
  const [axis3DNames, setAxis3DNames] = useState<{ x: string; y: string; z: string }>({ x: 'X', y: 'Y', z: 'Z' });
  const [chainPoints, setChainPoints] = useState<boolean>(false);
  const [canvasSize, setCanvasSize] = useState<number>(600);
  const [scale2D, setScale2D] = useState<number>(50);
  const [cameraDistance, setCameraDistance] = useState<number>(10);
  const [showCircle, setShowCircle] = useState<boolean>(false);
  const [showRadius, setShowRadius] = useState<boolean>(false);
  const [showAngles, setShowAngles] = useState<boolean>(false);

  const [polarCoords, setPolarCoords] = useState<PolarCoords>(cartesianToPolar(point2D, thetaRange));
  const [cylindricalCoords, setCylindricalCoords] = useState<CylindricalCoords>(cartesianToCylindrical(point3D, thetaRange));
  const [sphericalCoords, setSphericalCoords] = useState<SphericalCoords>(cartesianToSpherical(point3D, thetaRange));

  useEffect(() => {
    setPolarCoords(cartesianToPolar(point2D, thetaRange));
  }, [point2D, thetaRange]);

  useEffect(() => {
    setCylindricalCoords(cartesianToCylindrical(point3D, thetaRange));
    setSphericalCoords(cartesianToSpherical(point3D, thetaRange));
  }, [point3D, thetaRange]);

  // Load persisted axis names from localStorage on mount
  useEffect(() => {
    try {
      const raw2 = localStorage.getItem('axis2DNames');
      const raw3 = localStorage.getItem('axis3DNames');
      if (raw2) setAxis2DNames(JSON.parse(raw2));
      if (raw3) setAxis3DNames(JSON.parse(raw3));
      const rawChain = localStorage.getItem('chainPoints');
      if (rawChain) setChainPoints(JSON.parse(rawChain));
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist axis names when changed
  useEffect(() => {
    try {
      localStorage.setItem('axis2DNames', JSON.stringify(axis2DNames));
    } catch (e) {}
  }, [axis2DNames]);

  useEffect(() => {
    try {
      localStorage.setItem('axis3DNames', JSON.stringify(axis3DNames));
    } catch (e) {}
  }, [axis3DNames]);

  useEffect(() => {
    try {
      localStorage.setItem('chainPoints', JSON.stringify(chainPoints));
    } catch (e) {}
  }, [chainPoints]);

  const handlePolarChange = (coords: PolarCoords) => {
    setPolarCoords(coords);
    const p2 = polarToCartesian(coords);
    setPoint2D(p2);
    if (chainPoints) {
      // chain to 3D: map x->x, y->y, keep z unchanged
      setPoint3D((prev) => ({ ...prev, x: p2.x, y: p2.y }));
    }
  };

  const handleCylindricalChange = (coords: CylindricalCoords) => {
    setCylindricalCoords(coords);
    const p3 = cylindricalToCartesian(coords);
    setPoint3D(p3);
    if (chainPoints) {
      setPoint2D({ x: p3.x, y: p3.y });
    }
  };

  const handleSphericalChange = (coords: SphericalCoords) => {
    setSphericalCoords(coords);
    const p3 = sphericalToCartesian(coords);
    setPoint3D(p3);
    if (chainPoints) {
      setPoint2D({ x: p3.x, y: p3.y });
    }
  };

  // When user drags/moves points in canvases
  const handlePoint2DChange = (p2: Point2D) => {
    setPoint2D(p2);
    if (chainPoints) setPoint3D((prev) => ({ ...prev, x: p2.x, y: p2.y }));
  };

  const handlePoint3DChange = (p3: Point3D) => {
    setPoint3D(p3);
    if (chainPoints) setPoint2D({ x: p3.x, y: p3.y });
  };

  const handleResetPoint = () => {
    // Reset 2D to (1,1) and 3D to (1,1,1)
    setPoint2D({ x: 1, y: 1 });
    setPoint3D({ x: 1, y: 1, z: 1 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Box className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              3D Axes Visualization
            </h1>
          </div>
          <p className="text-gray-600">
            Interactive tool to understand 2D and 3D coordinate systems with geometric shapes
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
              <Controls
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                shapePreset={shapePreset}
                onShapePresetChange={setShapePreset}
                perspectivePreset={perspectivePreset}
                onPerspectivePresetChange={setPerspectivePreset}
                chainPoints={chainPoints}
                onChainPointsChange={setChainPoints}
                onResetPoint={handleResetPoint}
                showCircle={showCircle}
                onShowCircleChange={setShowCircle}
                showRadius={showRadius}
                onShowRadiusChange={setShowRadius}
                showAngles={showAngles}
                onShowAnglesChange={setShowAngles}
              />
            </div>
            <ThetaRangeSettings
              thetaRange={thetaRange}
              onThetaRangeChange={setThetaRange}
            />
          </div>

          <div className={`grid grid-cols-1 ${viewMode === 'both' ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-6`}>
            {(viewMode === '2d' || viewMode === 'both') && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">2D View (XY Plane)</h2>
                <Canvas2D
                  point={point2D}
                  onPointChange={handlePoint2DChange}
                  axisLabels={axis2DNames}
                  canvasSize={canvasSize}
                  scale={scale2D}
                  onCanvasSizeChange={setCanvasSize}
                  onScaleChange={setScale2D}
                  showCircle={showCircle}
                  showRadius={showRadius}
                  showAngles={showAngles}
                />
              </div>
            )}

            {(viewMode === '3d' || viewMode === 'both') && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">3D View</h2>
                <Canvas3D
                  point={point3D}
                  onPointChange={handlePoint3DChange}
                  perspectivePreset={perspectivePreset}
                  shapePreset={shapePreset}
                  axisLabels={axis3DNames}
                  canvasSize={canvasSize}
                  cameraDistance={cameraDistance}
                  onCameraDistanceChange={setCameraDistance}
                  onCanvasSizeChange={setCanvasSize}
                  showCircle={showCircle}
                  showRadius={showRadius}
                  showAngles={showAngles}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CoordinateDisplay
              viewMode={viewMode}
              point2D={point2D}
              point3D={point3D}
              polarCoords={polarCoords}
              cylindricalCoords={cylindricalCoords}
              sphericalCoords={sphericalCoords}
            />

            <CoordinateInputs
              viewMode={viewMode}
              shapePreset={shapePreset}
              polarCoords={polarCoords}
              cylindricalCoords={cylindricalCoords}
              sphericalCoords={sphericalCoords}
              thetaRange={thetaRange}
              onPolarChange={handlePolarChange}
              onCylindricalChange={handleCylindricalChange}
              onSphericalChange={handleSphericalChange}
            />

            <FormulaCard viewMode={viewMode} shapePreset={shapePreset} />
          </div>
        </div>
      </div>
      {/* Axis name settings moved to after main containers */}
      <div className="container mx-auto px-4 py-8">
        <AxisNameSettings
          axis2D={axis2DNames}
          axis3D={axis3DNames}
          onAxis2DChange={setAxis2DNames}
          onAxis3DChange={setAxis3DNames}
        />
      </div>
    </div>
  );
}

export default App;
