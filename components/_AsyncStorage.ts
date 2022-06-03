import AsyncStorage from '@react-native-async-storage/async-storage'

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
