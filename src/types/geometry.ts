export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface PolarCoords {
  r: number;
  theta: number;
}

export interface CylindricalCoords {
  r: number;
  theta: number;
  y: number;
}

export interface SphericalCoords {
  rho: number;
  theta: number;
  phi: number;
}

export interface CylinderParams {
  radius: number;
  height: number;
  segments: number;
}

export interface SphereParams {
  radius: number;
  segments: number;
}

export type ViewMode = '2d' | '3d' | 'both';
export type ShapePreset = 'none' | 'cylinder' | 'sphere';
export type PerspectivePreset = 'free' | 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'isometric';

export interface Camera3D {
  angleX: number;
  angleY: number;
  distance: number;
}

export const PERSPECTIVE_PRESETS: Record<PerspectivePreset, { angleX: number; angleY: number; distance: number; label: string }> = {
  free: { angleX: 0.5, angleY: 0.8, distance: 10, label: 'Free View' },
  front: { angleX: 0, angleY: 0, distance: 10, label: 'Front (XY)' },
  back: { angleX: 0, angleY: Math.PI, distance: 10, label: 'Back' },
  left: { angleX: 0, angleY: -Math.PI / 2, distance: 10, label: 'Left (YZ)' },
  right: { angleX: 0, angleY: Math.PI / 2, distance: 10, label: 'Right (YZ)' },
  top: { angleX: Math.PI / 2, angleY: 0, distance: 10, label: 'Top (XZ)' },
  bottom: { angleX: -Math.PI / 2, angleY: 0, distance: 10, label: 'Bottom' },
  isometric: { angleX: Math.PI / 6, angleY: Math.PI / 4, distance: 12, label: 'Isometric' }
};
