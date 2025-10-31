import { ViewMode, ShapePreset } from '../types/geometry';
import { BookOpen } from 'lucide-react';

interface FormulaCardProps {
  viewMode: ViewMode;
  shapePreset: ShapePreset;
}

export function FormulaCard({ viewMode, shapePreset }: FormulaCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Formulas & Concepts</h3>
      </div>

      <div className="space-y-4 text-sm">
  {(viewMode === '2d' || viewMode === 'both') && (
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-gray-800 mb-2">2D Coordinate System</h4>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Point representation:</span> P = (x, y)
              </p>
              <p className="text-xs leading-relaxed">
                In 2D space, any point can be represented by two coordinates on the XY plane.
                The x-coordinate represents horizontal distance from the origin, and y-coordinate
                represents vertical distance.
              </p>
              <p className="mt-3">
                <span className="font-medium">Distance from origin:</span> d = √(x² + y²)
              </p>
            </div>
          </div>
        )}

  {(viewMode === '3d' || viewMode === 'both') && (
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-gray-800 mb-2">3D Coordinate System</h4>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Point representation:</span> P = (x, y, z)
              </p>
              <p className="text-xs leading-relaxed">
                In 3D space, any point requires three coordinates. The x and z coordinates define
                position on the horizontal plane, while y represents vertical height.
              </p>
              <p className="mt-3">
                <span className="font-medium">Distance from origin:</span> d = √(x² + y² + z²)
              </p>
              <p className="mt-2 text-xs leading-relaxed">
                <span className="font-medium">3D Rotation:</span> To view 3D objects from different
                angles, we apply rotation matrices around the X and Y axes, then project onto a 2D
                screen using perspective projection.
              </p>
            </div>
          </div>
        )}

        {shapePreset === 'cylinder' && (
          <div className="bg-white rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-700 mb-2">Cylindrical Coordinates</h4>
            <div className="space-y-2 text-gray-700">
              {viewMode === '2d' && (
                <>
                  <p className="text-xs leading-relaxed">
                    <span className="font-medium">Polar (2D Cross-section):</span>
                  </p>
                  <p className="text-xs font-mono">x = r · cos(θ)</p>
                  <p className="text-xs font-mono">y = r · sin(θ)</p>
                  <p className="text-xs leading-relaxed mt-2">
                    where r ≥ 0, θ ∈ [0, 2π)
                  </p>
                  <p className="text-xs leading-relaxed mt-2">
                    The angle θ is measured from the positive X-axis in the XY plane.
                  </p>
                </>
              )}
              {viewMode === '3d' && (
                <>
                  <p className="text-xs leading-relaxed">
                    <span className="font-medium">Cylindrical Coordinates (r, θ, h):</span>
                  </p>
                  <p className="text-xs font-mono">x = r · cos(θ)</p>
                  <p className="text-xs font-mono">y = h</p>
                  <p className="text-xs font-mono">z = r · sin(θ)</p>
                  <p className="text-xs leading-relaxed mt-2">
                    where r ≥ 0, θ ∈ [0, 2π), h ∈ ℝ
                  </p>
                  <p className="text-xs leading-relaxed mt-2">
                    The angle θ is measured from the positive X-axis in the XZ plane (horizontal).
                    The height h is measured along the Y-axis.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {shapePreset === 'sphere' && (
          <div className="bg-white rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-700 mb-2">Spherical Coordinates</h4>
            <div className="space-y-2 text-gray-700">
              {viewMode === '2d' && (
                <>
                  <p className="text-xs leading-relaxed">
                    <span className="font-medium">Polar (2D Cross-section):</span>
                  </p>
                  <p className="text-xs font-mono">x = r · cos(θ)</p>
                  <p className="text-xs font-mono">y = r · sin(θ)</p>
                  <p className="text-xs leading-relaxed mt-2">
                    where r ≥ 0, θ ∈ [0, 2π)
                  </p>
                </>
              )}
              {viewMode === '3d' && (
                <>
                  <p className="text-xs leading-relaxed">
                    <span className="font-medium">Spherical Coordinates (ρ, θ, φ):</span>
                  </p>
                  <p className="text-xs font-mono">x = ρ · sin(φ) · cos(θ)</p>
                  <p className="text-xs font-mono">y = ρ · cos(φ)</p>
                  <p className="text-xs font-mono">z = ρ · sin(φ) · sin(θ)</p>
                  <p className="text-xs leading-relaxed mt-2">
                    where ρ ≥ 0, φ ∈ [0, π], θ ∈ [0, 2π)
                  </p>
                  <p className="text-xs leading-relaxed mt-2">
                    ρ (rho) is the distance from origin to point.
                    φ (phi) is the angle from the positive Y-axis.
                    θ (theta) is the azimuthal angle in the XZ plane.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Interactions</h4>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• Drag the red point to move it around</li>
            {viewMode === '3d' && (
              <>
                <li>• Drag the background to rotate the view</li>
                <li>• Use mouse wheel to zoom in/out</li>
              </>
            )}
            <li>• Toggle between 2D and 3D views to see different perspectives</li>
            <li>• Select shape presets to see how the point defines shapes</li>
            <li>• The point position determines the shape's dimensions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
