import { Point2D, Point3D, PolarCoords, CylindricalCoords, SphericalCoords } from '../types/geometry';

interface CoordinateDisplayProps {
  viewMode: '2d' | '3d' | 'both';
  point2D: Point2D;
  point3D: Point3D;
  polarCoords: PolarCoords;
  cylindricalCoords: CylindricalCoords;
  sphericalCoords: SphericalCoords;
}

export function CoordinateDisplay({
  viewMode,
  point2D,
  point3D,
  polarCoords,
  cylindricalCoords,
  sphericalCoords
}: CoordinateDisplayProps) {
  const toDegrees = (rad: number) => ((rad * 180) / Math.PI).toFixed(1);

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Coordinates</h3>

  {(viewMode === '2d' || viewMode === 'both') && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2 text-sm">Cartesian (x, y)</h4>
            <p className="font-mono text-sm">
              ({point2D.x.toFixed(3)}, {point2D.y.toFixed(3)})
            </p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2 text-sm">Polar (r, θ)</h4>
            <p className="font-mono text-sm">
              r = {polarCoords.r.toFixed(3)}
            </p>
            <p className="font-mono text-sm">
              θ = {toDegrees(polarCoords.theta)}° ({polarCoords.theta.toFixed(3)} rad)
            </p>
          </div>
        </div>
      )}

  {(viewMode === '3d' || viewMode === 'both') && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2 text-sm">Cartesian (x, y, z)</h4>
            <p className="font-mono text-sm">
              ({point3D.x.toFixed(3)}, {point3D.y.toFixed(3)}, {point3D.z.toFixed(3)})
            </p>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-semibold text-green-700 mb-2 text-sm">Cylindrical (r, θ, y)</h4>
            <p className="font-mono text-sm">
              r = {cylindricalCoords.r.toFixed(3)}
            </p>
            <p className="font-mono text-sm">
              θ = {toDegrees(cylindricalCoords.theta)}° ({cylindricalCoords.theta.toFixed(3)} rad)
            </p>
            <p className="font-mono text-sm">
              y = {cylindricalCoords.y.toFixed(3)}
            </p>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <h4 className="font-semibold text-orange-700 mb-2 text-sm">Spherical (ρ, θ, φ)</h4>
            <p className="font-mono text-sm">
              ρ = {sphericalCoords.rho.toFixed(3)}
            </p>
            <p className="font-mono text-sm">
              θ = {toDegrees(sphericalCoords.theta)}° ({sphericalCoords.theta.toFixed(3)} rad)
            </p>
            <p className="font-mono text-sm">
              φ = {toDegrees(sphericalCoords.phi)}° ({sphericalCoords.phi.toFixed(3)} rad)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
