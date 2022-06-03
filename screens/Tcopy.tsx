import React, { useState, useEffect } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { Accelerometer, Magnetometer } from 'expo-sensors'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Xi= X n-1 ± [ Sen(ω(n-1)-ωn) * Cos(i) ]* D
// Yi=Y n-1 +[ Cos(ω(n-1)-ωn) * Cos(i) ]* D
// Zi= Z n-1 + D * Sen(i)

type dataPoint = { x: number, y: number, z: number, i: number, w: number}
type dataStatus = {radiano: number, graus: number, e: {x:Number, y:number, z:number}, variancia: number} | null

const data : dataPoint[] = []
let count = 0

const calibrarW : number[] = []
let nVariancia : number = 0

const calibrarI : number[] = []
let iVariancia : number = 0

let time = 0

export default function TabThreeScreen () {
  const [useMagnetrometro, setMagnetrometro] = useState<dataStatus>(null)
  const [useAccelerometer, setAccelerometer] = useState<dataStatus>(null)
  const [distancia] = useState(1000)
  const [updateInterval] = useState(1000)
  const [useTime, setTime] = useState(0)
  const [numberCalibration] = useState(20)

  function _Accelerometer () {
    Accelerometer.setUpdateInterval(updateInterval)
    Accelerometer.addListener(e => {
      const { x, y, z } = e
      const radiano = Math.atan2(y, z)
      const graus = radiano * (180 / Math.PI)

      if (calibrarI.length < numberCalibration) {
        console.log('calibrarI: ', calibrarI.length)
        calibrarI.push(radiano)
      } else if (calibrarI.length === numberCalibration) {
        calibrarI.push(radiano)
        const media = calibrarI.reduce((a, b) => a + b, 0) / calibrarI.length

        calibrarI.forEach((a) => {
          const b = Math.abs(a - media)
          if (b > iVariancia) { iVariancia = b }
        })
      } else {
        time = time + updateInterval
        console.log(time)
        setTime(time)

        const obj : dataStatus = { radiano, graus, variancia: iVariancia, e }
        setAccelerometer(obj)
      }
    })
  }

  function _Magnetometer () {
    Magnetometer.setUpdateInterval(updateInterval)
    Magnetometer.addListener(e => {
      const { x, y, z } = e
      const radiano = 90 * Math.PI / 180 - Math.atan2(y, x)
      const graus = radiano * (180 / Math.PI)
      if (calibrarW.length < numberCalibration) {
        console.log('calibrarW: ', calibrarW.length)
        calibrarW.push(radiano)
      } else if (calibrarW.length === numberCalibration) {
        calibrarW.push(radiano)
        const media = calibrarW.reduce((a, b) => a + b, 0) / calibrarW.length

        calibrarW.forEach((a) => {
          const b = Math.abs(a - media)
          if (b > nVariancia) { nVariancia = b }
        })
        nVariancia = nVariancia
      } else {
        const obj : dataStatus = { radiano, graus, variancia: nVariancia, e }
        setMagnetrometro(obj)
      }
    })
  }

  function _start () {
    const atual : dataPoint = { x: 0, y: 0, z: 0, i: 0, w: 0 }
    let anterior : dataPoint = { x: 0, y: 0, z: 0, i: 0, w: 0 }

    anterior = data[data.length - 1] ? data[data.length - 1] : anterior

    if (useAccelerometer && useMagnetrometro) {
      atual.i = useAccelerometer.radiano
      atual.w = useMagnetrometro.radiano
    }
    atual.x = Math.round(anterior.x + (Math.sin(anterior.w - atual.w) * Math.cos(atual.i)) * distancia)
    atual.y = Math.round(anterior.y + (Math.cos(anterior.w - atual.w) * Math.cos(atual.i)) * distancia)
    atual.z = Math.round(anterior.z + (Math.sin(atual.i)) * distancia)

    const wDiferenca = Math.abs(atual.w - anterior.w)
    const iDiferenca = Math.abs(atual.i - anterior.i)

    if (wDiferenca > nVariancia &&
      iDiferenca > iVariancia
    ) {
      data.push(atual)
      // console.log(atual)
      console.log('atual : ', atual, ' iVariancia : ', iVariancia * (180 / Math.PI), 'wVariancia : ', nVariancia * (180 / Math.PI))
    }

    if (Number.isInteger(data.length / 20) && data.length !== 0) {
      console.log('save')
      storeData('data', data)
    }
  }

  async function storeData (name: string, value: dataPoint[]): Promise<void> {
    try {
      await AsyncStorage.setItem(name, JSON.stringify(value))
    } catch (e) {
    }
  }

  async function getData (name:string): Promise<dataPoint[] | string | undefined> {
    console.log('click')
    try {
      const value : null | string = await AsyncStorage.getItem(name)
      if (value !== null) {
        console.log('getdata', value)
        return JSON.parse(value)
      } else {
        return 'Nada sauvo!'
      }
    } catch (e) {
      const value : null | string = JSON.stringify(e)
      console.log('getdata', value)
      return value
    }
  }
  useEffect(() => {
    if (count === 0) {
      _Accelerometer()
      _Magnetometer()
      console.log('start')
      count++
    }

    if (useMagnetrometro && useAccelerometer) {
      _start()
    }
  }, [useMagnetrometro, useAccelerometer])

  return (
    useMagnetrometro && useAccelerometer && useTime &&
    <View style={styles.container}>
      <Text>
      Norte: {useMagnetrometro.graus}
      </Text>
      <Text>
      Inclinação: {useAccelerometer.graus}
      </Text>
      <Text>
      Aceleracão: {useAccelerometer.e.y}
      </Text>
      <Text>
      Time: {useTime / 1000}
      </Text>
      <Button title='data' onPress={() => { getData('data') }}/>
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
