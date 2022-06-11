import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Accelerometer, Magnetometer } from 'expo-sensors'
import _CalcPosition from '../components/_CalcPosition'
import _Sensor from '../components/_Sensor'

// Xi= X n-1 ± [ Sen(ω(n-1)-ωn) * Cos(i) ]* D
// Yi=Y n-1 +[ Cos(ω(n-1)-ωn) * Cos(i) ]* D
// Zi= Z n-1 + D * Sen(i)

type dataPoint = { x: number, y: number, z: number, i: number, w: number}
type sensor = {x:number, y:number, z:number, modulo:number} | null
const data : dataPoint[] = []
const distancia = 100
let count = 0
let velocidade = 0
let time = Date.now()
export default function TabThreeScreen () {
  const [useMagnetometer, setMagnetometer] = useState<sensor>(null)
  const [useAccelerometer, setAccelerometer] = useState<sensor>(null)
  const [updateInterval] = useState(100)
  useEffect(() => {
    if (count === 0) {
      count++
      console.log('Accelerometer')
      _Sensor([Accelerometer, updateInterval, setAccelerometer])

      console.log('Magnetometer')
      _Sensor([Magnetometer, updateInterval, setMagnetometer])
    }

    if (useMagnetometer && useAccelerometer) {
      const position : dataPoint[] = _CalcPosition({ useMagnetometer, useAccelerometer, data, distancia })
      data.push(position)
    }
  }, [useMagnetometer, useAccelerometer])

  function norteGraus () {
    const a = Math.atan2(useMagnetometer.y, useMagnetometer.x) * (180 / Math.PI) - 90
    if (a < 0) {
      return (a + 360).toFixed(1)
    } else {
      return a.toFixed(1)
    }
  }
  function _velocidade () {
    const aceleracao = Math.sqrt(useAccelerometer.x ** 2 + useAccelerometer.y ** 2 + useAccelerometer.z ** 2)
    console.log((Date.now() - time) / 1000)
    velocidade = velocidade + (Date.now() - time) / 1000 * (aceleracao - useAccelerometer.modulo) * 9.81
    time = Date.now()
    return velocidade
  }

  return (
    <View style={styles.container}>
      {
      useMagnetometer && useAccelerometer &&
      <View style={styles.container}>
        <Text>
        Norte: {norteGraus()}
        </Text>
        <Text>
        Inclinação: {(Math.atan2(useAccelerometer.y, useAccelerometer.z) * (180 / Math.PI)).toFixed(1)}
        </Text>
        <Text>
        Modulo gravidade: {
         (
           Math.sqrt(useAccelerometer.x ** 2 + useAccelerometer.y ** 2 + useAccelerometer.z ** 2) -
            useAccelerometer.modulo
         )}
        </Text>
        <Text>
        Velocidade: {_velocidade()}
        </Text>
      </View>
      }
      {
      !useMagnetometer && !useAccelerometer &&
      <View style={styles.container}>
        <Text>
       Agarde : Estamos Calibrando...
        </Text>

      </View>
      }
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  text: {
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc'
  }
})
