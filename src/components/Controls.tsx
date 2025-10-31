import { ViewMode, ShapePreset, PerspectivePreset, PERSPECTIVE_PRESETS } from '../types/geometry';

interface ControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  shapePreset: ShapePreset;
  onShapePresetChange: (preset: ShapePreset) => void;
  perspectivePreset: PerspectivePreset;
  onPerspectivePresetChange: (preset: PerspectivePreset) => void;
  chainPoints: boolean;
  onChainPointsChange: (v: boolean) => void;
  onResetPoint: () => void;
  showCircle: boolean;
  onShowCircleChange: (v: boolean) => void;
  showRadius: boolean;
  onShowRadiusChange: (v: boolean) => void;
  showAngles: boolean;
  onShowAnglesChange: (v: boolean) => void;
}

export function Controls({
  viewMode,
  onViewModeChange,
  shapePreset,
  onShapePresetChange,
  perspectivePreset,
  onPerspectivePresetChange,
  chainPoints,
  onChainPointsChange,
  onResetPoint,
  showCircle,
  onShowCircleChange,
  showRadius,
  onShowRadiusChange,
  showAngles,
  onShowAnglesChange
}: ControlsProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">View Mode</label>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const is2D = viewMode === '2d' || viewMode === 'both';
              const is3D = viewMode === '3d' || viewMode === 'both';
              const new2D = !is2D;
              const new3D = is3D;
              let next: ViewMode;
              if (new2D && new3D) next = 'both';
              else if (new2D) next = '2d';
              else if (new3D) next = '3d';
              else next = '2d';
              onViewModeChange(next);
            }}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              (viewMode === '2d' || viewMode === 'both')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            2D View
          </button>

          <button
            onClick={() => {
              const is2D = viewMode === '2d' || viewMode === 'both';
              const is3D = viewMode === '3d' || viewMode === 'both';
              const new2D = is2D;
              const new3D = !is3D;
              let next: ViewMode;
              if (new2D && new3D) next = 'both';
              else if (new2D) next = '2d';
              else if (new3D) next = '3d';
              else next = '2d';
              onViewModeChange(next);
            }}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              (viewMode === '3d' || viewMode === 'both')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            3D View
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={chainPoints}
            onChange={(e) => onChainPointsChange(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-sm text-gray-700">Chain 2D & 3D point updates</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={showCircle}
            onChange={(e) => onShowCircleChange(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-sm text-gray-700">Show circle/cylinder</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={showRadius}
            onChange={(e) => onShowRadiusChange(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-sm text-gray-700">Show radius</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={showAngles}
            onChange={(e) => onShowAnglesChange(e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="text-sm text-gray-700">Show angles</span>
        </label>

        <button
          onClick={onResetPoint}
          className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 w-full"
          title="Reset point to (1,1)"
        >
          Reset point (1,1)
        </button>
      </div>

      {(viewMode === '3d' || viewMode === 'both') && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Camera Perspective (3D)</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PERSPECTIVE_PRESETS) as PerspectivePreset[]).map((preset) => (
              <button
                key={preset}
                onClick={() => onPerspectivePresetChange(preset)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  perspectivePreset === preset
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {PERSPECTIVE_PRESETS[preset].label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Shape Preset</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onShapePresetChange('none')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              shapePreset === 'none'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            None
          </button>
          <button
            onClick={() => onShapePresetChange('cylinder')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              shapePreset === 'cylinder'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cylinder
          </button>
          <button
            onClick={() => onShapePresetChange('sphere')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              shapePreset === 'sphere'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sphere
          </button>
        </div>
      </div>
    </div>
  );
}
