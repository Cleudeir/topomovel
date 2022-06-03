import { Magnetometer } from 'expo-sensors'
type eixos = { x: number, y: number, z: number }
let count = 0
const qnt = 100
const amostras : number[] = []
let error : eixos = { x: 0, y: 0, z: 0 }
export default function _Magnetometer ({ updateInterval, setMagnetometer }) {
  Magnetometer.setUpdateInterval(updateInterval)
  Magnetometer.addListener(e => {
    if (count < qnt) {
      amostras.push(e)
    } else if (count === qnt) {
      let xSoma = 0
      let ySoma = 0
      let zSoma = 0
      const xMax = 0
      const yMax = 0
      const zMax = 0

      amostras.forEach((eixo) => {
        xSoma += (eixo.x)
        ySoma += (eixo.y)
        zSoma += (eixo.z)
        if (xMax < eixo.x) {
          xMax = eixo.x
        }
        if (yMax < eixo.y) {
          yMax = eixo.y
        }
        if (zMax < eixo.z) {
          zMax = eixo.z
        }
      })

      const xMedia = xSoma / amostras.length
      const yMedia = ySoma / amostras.length
      const zMedia = zSoma / amostras.length

      const xdesvio = xMax - xMedia
      const ydesvio = yMax - yMedia
      const zdesvio = zMax - zMedia

      error = {
        x: xdesvio,
        y: ydesvio,
        z: zdesvio
      }
      count++
    }else{
      if(error.x>e.x)
    }
    setMagnetometer(eixos)

    count++
  })///******************** */
}
