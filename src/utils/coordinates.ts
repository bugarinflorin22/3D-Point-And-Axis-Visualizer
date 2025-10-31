import { Point2D, Point3D, PolarCoords, CylindricalCoords, SphericalCoords } from '../types/geometry';

export type ThetaRange = '0-360' | '-180-180';

export function normalizeTheta(theta: number, range: ThetaRange = '0-360'): number {
  if (range === '0-360') {
    let normalized = theta % (2 * Math.PI);
    if (normalized < 0) {
      normalized += 2 * Math.PI;
    }
    return normalized;
  } else {
    let normalized = theta % (2 * Math.PI);
    if (normalized > Math.PI) {
      normalized -= 2 * Math.PI;
    } else if (normalized < -Math.PI) {
      normalized += 2 * Math.PI;
    }
    return normalized;
  }
}

export function cartesianToPolar(point: Point2D, thetaRange: ThetaRange = '0-360'): PolarCoords {
  const r = Math.sqrt(point.x * point.x + point.y * point.y);
  let theta = Math.atan2(point.y, point.x);
  theta = normalizeTheta(theta, thetaRange);
  return { r, theta };
}

export function polarToCartesian(polar: PolarCoords): Point2D {
  return {
    x: polar.r * Math.cos(polar.theta),
    y: polar.r * Math.sin(polar.theta)
  };
}

export function cartesianToCylindrical(point: Point3D, thetaRange: ThetaRange = '0-360'): CylindricalCoords {
  const r = Math.sqrt(point.x * point.x + point.y * point.y);
  let theta = Math.atan2(point.y, point.x);
  theta = normalizeTheta(theta, thetaRange);
  return { r, theta, y: point.z };  // Z is now vertical
}

export function cylindricalToCartesian(cylindrical: CylindricalCoords): Point3D {
  return {
    x: cylindrical.r * Math.cos(cylindrical.theta),
    y: cylindrical.r * Math.sin(cylindrical.theta),  // Y is now depth
    z: cylindrical.y                                   // Z is now vertical
  };
}

export function cartesianToSpherical(point: Point3D, thetaRange: ThetaRange = '0-360'): SphericalCoords {
  const rho = Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z);
  let theta = Math.atan2(point.y, point.x);
  theta = normalizeTheta(theta, thetaRange);
  const phi = rho > 0 ? Math.acos(point.z / rho) : 0;  // Z is now vertical
  return { rho, theta, phi };
}

export function sphericalToCartesian(spherical: SphericalCoords): Point3D {
  return {
    x: spherical.rho * Math.sin(spherical.phi) * Math.cos(spherical.theta),
    y: spherical.rho * Math.sin(spherical.phi) * Math.sin(spherical.theta),  // Y is now depth
    z: spherical.rho * Math.cos(spherical.phi)                                // Z is now vertical
  };
}
