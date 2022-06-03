import React, { useState, useEffect } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import _Accelerometer from '../components/_Accelerometer'
import _CalcPosition from '../components/_CalcPosition'
import _Magnetometer from '../components/_Magnetometer'

// Xi= X n-1 ± [ Sen(ω(n-1)-ωn) * Cos(i) ]* D
// Yi=Y n-1 +[ Cos(ω(n-1)-ωn) * Cos(i) ]* D
// Zi= Z n-1 + D * Sen(i)

type dataPoint = { x: number, y: number, z: number, i: number, w: number}
type sensor = {x:number, y:number, z:number} | null
let data : dataPoint[] = []
const distancia = 1000
let count = 0

export default function TabThreeScreen () {
  const [useMagnetometer, setMagnetometer] = useState<sensor>(null)
  const [useAccelerometer, setAccelerometer] = useState<sensor>(null)
  const [updateInterval] = useState(1000)

  useEffect(() => {
    if (count === 0) {
      console.log('start')
      _Accelerometer({ updateInterval, setAccelerometer })
      _Magnetometer({ updateInterval, setMagnetometer })
      count++
    }

    if (useMagnetometer && useAccelerometer) {
      data = _CalcPosition({ useMagnetometer, useAccelerometer, data, distancia })
    }
  }, [useMagnetometer, useAccelerometer])

  return (
    useMagnetometer && useAccelerometer &&
    <View style={styles.container}>
      <Text>
      Norte: {useMagnetometer.x}
      </Text>
      <Text>
      Inclinação: {useAccelerometer.x}
      </Text>
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
