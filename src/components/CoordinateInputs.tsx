import { ShapePreset, PolarCoords, CylindricalCoords, SphericalCoords } from '../types/geometry';
import { ThetaRange } from '../utils/coordinates';

interface CoordinateInputsProps {
  viewMode: '2d' | '3d' | 'both';
  shapePreset: ShapePreset;
  polarCoords: PolarCoords;
  cylindricalCoords: CylindricalCoords;
  sphericalCoords: SphericalCoords;
  thetaRange: ThetaRange;
  onPolarChange: (coords: PolarCoords) => void;
  onCylindricalChange: (coords: CylindricalCoords) => void;
  onSphericalChange: (coords: SphericalCoords) => void;
}

export function CoordinateInputs({
  viewMode,
  shapePreset,
  polarCoords,
  cylindricalCoords,
  sphericalCoords,
  thetaRange,
  onPolarChange,
  onCylindricalChange,
  onSphericalChange
}: CoordinateInputsProps) {
  const toDegrees = (rad: number) => ((rad * 180) / Math.PI).toFixed(1);
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const thetaMin = thetaRange === '0-360' ? 0 : -180;
  const thetaMax = thetaRange === '0-360' ? 360 : 180;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Coordinate Systems</h3>

  {(viewMode === '2d' || viewMode === 'both') && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3">Polar Coordinates</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Radius (r): {polarCoords.r.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.1"
                  value={polarCoords.r}
                  onChange={(e) =>
                    onPolarChange({ ...polarCoords, r: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Angle θ: {toDegrees(polarCoords.theta)}°
                </label>
                <input
                  type="range"
                  min={thetaMin}
                  max={thetaMax}
                  step="1"
                  value={(polarCoords.theta * 180) / Math.PI}
                  onChange={(e) =>
                    onPolarChange({
                      ...polarCoords,
                      theta: toRadians(parseFloat(e.target.value))
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

  {(viewMode === '3d' || viewMode === 'both') && (
        <div className="space-y-4">
          {shapePreset === 'cylinder' && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">Cylindrical Coordinates</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Radius (r): {cylindricalCoords.r.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.1"
                    value={cylindricalCoords.r}
                    onChange={(e) =>
                      onCylindricalChange({
                        ...cylindricalCoords,
                        r: parseFloat(e.target.value)
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Angle θ: {toDegrees(cylindricalCoords.theta)}°
                  </label>
                  <input
                    type="range"
                    min={thetaMin}
                    max={thetaMax}
                    step="1"
                    value={(cylindricalCoords.theta * 180) / Math.PI}
                    onChange={(e) =>
                      onCylindricalChange({
                        ...cylindricalCoords,
                        theta: toRadians(parseFloat(e.target.value))
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (y): {cylindricalCoords.y.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={cylindricalCoords.y}
                    onChange={(e) =>
                      onCylindricalChange({
                        ...cylindricalCoords,
                        y: parseFloat(e.target.value)
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {shapePreset === 'sphere' && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-3">Spherical Coordinates</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Radius (ρ): {sphericalCoords.rho.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.1"
                    value={sphericalCoords.rho}
                    onChange={(e) =>
                      onSphericalChange({
                        ...sphericalCoords,
                        rho: parseFloat(e.target.value)
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Azimuthal θ: {toDegrees(sphericalCoords.theta)}°
                  </label>
                  <input
                    type="range"
                    min={thetaMin}
                    max={thetaMax}
                    step="1"
                    value={(sphericalCoords.theta * 180) / Math.PI}
                    onChange={(e) =>
                      onSphericalChange({
                        ...sphericalCoords,
                        theta: toRadians(parseFloat(e.target.value))
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Elevation φ: {toDegrees(sphericalCoords.phi)}°
                  </label>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="1"
                    value={(sphericalCoords.phi * 180) / Math.PI}
                    onChange={(e) =>
                      onSphericalChange({
                        ...sphericalCoords,
                        phi: toRadians(parseFloat(e.target.value))
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {shapePreset === 'none' && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Select a shape preset to see coordinate inputs
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
