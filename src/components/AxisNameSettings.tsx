import { Settings } from 'lucide-react';

interface AxisNameSettingsProps {
  axis2D: { x: string; y: string };
  axis3D: { x: string; y: string; z: string };
  onAxis2DChange: (axis: { x: string; y: string }) => void;
  onAxis3DChange: (axis: { x: string; y: string; z: string }) => void;
}

export function AxisNameSettings({ axis2D, axis3D, onAxis2DChange, onAxis3DChange }: AxisNameSettingsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Axis Labels</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">2D Axes</div>
          <div className="flex gap-2">
            <input
              value={axis2D.x}
              onChange={(e) => onAxis2DChange({ ...axis2D, x: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="X label"
            />
            <input
              value={axis2D.y}
              onChange={(e) => onAxis2DChange({ ...axis2D, y: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="Y label"
            />
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">3D Axes</div>
          <div className="flex gap-2">
            <input
              value={axis3D.x}
              onChange={(e) => onAxis3DChange({ ...axis3D, x: e.target.value })}
              className="w-1/3 px-3 py-2 border rounded-lg"
              placeholder="X label"
            />
            <input
              value={axis3D.y}
              onChange={(e) => onAxis3DChange({ ...axis3D, y: e.target.value })}
              className="w-1/3 px-3 py-2 border rounded-lg"
              placeholder="Y label"
            />
            <input
              value={axis3D.z}
              onChange={(e) => onAxis3DChange({ ...axis3D, z: e.target.value })}
              className="w-1/3 px-3 py-2 border rounded-lg"
              placeholder="Z label"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
