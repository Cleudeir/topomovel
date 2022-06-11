type eixos = { x: number, y: number, z: number }
type sensorType = [
  Function,
  number,
  Function
]
export default function _Sensor ([sensor, updateInterval, setSensor]:sensorType) {
  // ------
  let count = 0
  let modulo = 1
  const qnt = 10 ** 4 / updateInterval
  const amostras : number[] = []
  let error : eixos = { x: 0, y: 0, z: 0 }
  let anterior : eixos = { x: 0, y: 0, z: 0 }
  // ------
  sensor.setUpdateInterval(updateInterval)
  sensor.addListener(e => {
    if (count < qnt) { // Coletar amostras para calibragem
      amostras.push(e)
      console.log(amostras.length)
      count++
    } else if (count === qnt) { // Definir taxa de erro
      let xSoma = 0
      let ySoma = 0
      let zSoma = 0

      amostras.forEach((eixo) => {
        xSoma += (eixo.x)
        ySoma += (eixo.y)
        zSoma += (eixo.z)
      })

      const xMedia = xSoma / amostras.length
      const yMedia = ySoma / amostras.length
      const zMedia = zSoma / amostras.length

      modulo = Math.sqrt(xMedia ** 2 + yMedia ** 2 + zMedia ** 2)

      let xDesvio = 0
      let yDesvio = 0
      let zDesvio = 0

      amostras.forEach((value) => {
        if (xDesvio < Math.abs(value.x - xMedia)) {
          xDesvio = Math.abs(value.x - xMedia)
        }
        if (yDesvio < Math.abs(value.y - yMedia)) {
          yDesvio = Math.abs(value.y - yMedia)
        }
        if (zDesvio < Math.abs(value.z - zMedia)) {
          zDesvio = Math.abs(value.z - zMedia)
        }
      })

      const majorar = 2
      error = {
        x: xDesvio * majorar,
        y: yDesvio * majorar,
        z: zDesvio * majorar
      }
      anterior = e
      setSensor({ ...e, modulo })
      console.log('error: ', error)
      count++
    } else { // Verificar se deslocamento é valor
      const upDateX = Math.abs(anterior.x - e.x)
      const upDateY = Math.abs(anterior.y - e.y)
      const upDateZ = Math.abs(anterior.z - e.z)

      if (error.x < upDateX || error.y < upDateY || error.z < upDateZ) {
        setSensor({ ...e, modulo })
        anterior = { ...e, modulo }
      }
    }
  })
}
