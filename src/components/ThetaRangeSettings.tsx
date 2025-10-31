import { Settings } from 'lucide-react';

export type ThetaRange = '0-360' | '-180-180';

interface ThetaRangeSettingsProps {
  thetaRange: ThetaRange;
  onThetaRangeChange: (range: ThetaRange) => void;
}

export function ThetaRangeSettings({ thetaRange, onThetaRangeChange }: ThetaRangeSettingsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">Theta Domain Settings</h3>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theta (θ) Range:
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => onThetaRangeChange('0-360')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
              thetaRange === '0-360'
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            0° to 360°
            <div className="text-xs opacity-70">(0 to 2π)</div>
          </button>
          <button
            onClick={() => onThetaRangeChange('-180-180')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
              thetaRange === '-180-180'
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            -180° to 180°
            <div className="text-xs opacity-70">(-π to π)</div>
          </button>
        </div>
      </div>
    </div>
  );
}
