type dataPoint = { x: number, y: number, z: number, i: number, w: number}
type calcType = {
      useMagnetometer: { x: number, y: number, z: number },
      useAccelerometer: { x: number, y: number, z: number },
      data : dataPoint[],
      distancia: number
    }
export default function _CalcPosition ({ useMagnetometer, useAccelerometer, data, distancia } : calcType) : dataPoint[] {
  const atual : dataPoint = { x: 0, y: 0, z: 0, i: 0, w: 0 }
  atual.i = Math.atan2(useAccelerometer.y, useAccelerometer.z)
  atual.w = Math.atan2(useMagnetometer.y, useMagnetometer.x) - 90 * Math.PI / 180
  const anterior : dataPoint = data[data.length - 1] ? data[data.length - 1] : atual
  atual.x = Math.round(anterior.x + (Math.sin(anterior.w - atual.w) * Math.cos(atual.i)) * distancia)
  atual.y = Math.round(anterior.y + (Math.cos(anterior.w - atual.w) * Math.cos(atual.i)) * distancia)
  atual.z = Math.round(anterior.z + (Math.sin(atual.i)) * distancia)

  return [...data, atual]
}
