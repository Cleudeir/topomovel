import { Accelerometer } from 'expo-sensors'
export default function _Accelerometer ({ updateInterval, setAccelerometer }) {
  Accelerometer.setUpdateInterval(updateInterval)
  Accelerometer.addListener(e => {
    setAccelerometer(e)
  })
}
