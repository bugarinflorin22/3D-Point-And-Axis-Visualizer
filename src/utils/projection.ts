import { Point3D, Point2D, Camera3D } from '../types/geometry';

export function project3DTo2D(
  point: Point3D,
  camera: Camera3D,
  width: number,
  height: number
): Point2D {
  const { angleX, angleY, distance } = camera;

  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);

  let x = point.x;
  let y = point.z;  // Swapped: Z is now vertical
  let z = point.y;  // Swapped: Y is now depth

  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;

  const x2 = x * cosY + z1 * sinY;
  const z2 = -x * sinY + z1 * cosY;

  const scale = distance / (distance + z2);

  return {
    x: width / 2 + x2 * scale * 50,
    y: height / 2 - y1 * scale * 50
  };
}

export function generateCylinderPoints(
  radius: number,
  height: number,
  segments: number,
  zOffset: number = 0
): Point3D[] {
  const points: Point3D[] = [];

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    points.push({ x, y, z: zOffset + height });
    points.push({ x, y, z: zOffset });
  }

  return points;
}

export function generateSpherePoints(
  radius: number,
  segments: number
): Point3D[] {
  const points: Point3D[] = [];

  for (let i = 0; i <= segments; i++) {
    const lat = (i / segments) * Math.PI - Math.PI / 2;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);

    for (let j = 0; j <= segments; j++) {
      const lon = (j / segments) * Math.PI * 2;

      points.push({
        x: Math.cos(lon) * cosLat * radius,
        y: Math.sin(lon) * cosLat * radius,  // Swapped: Y is now depth
        z: sinLat * radius                     // Swapped: Z is now vertical
      });
    }
  }

  return points;
}
