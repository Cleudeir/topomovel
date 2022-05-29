import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Magnetometer } from 'expo-sensors';

const a1 = []

const a2 = []
export default function TabThreeScreen() {

  const [useNorte,setNorte] = useState(0)
  const [useNorteAccuracy,setNorteAccuracy] = useState(0)

  const [useInclinacao,setInclinacao] = useState(0)
  const [useIncliAccuracy,setIncliAccuracy] = useState(0)

  const [UpdateInterval] = useState(500)
  
  function _Accelerometer(){
    Accelerometer.setUpdateInterval(UpdateInterval)
    Accelerometer.addListener(e => {
      const {x,y,z} = e
      const i = Math.atan2(y,z) * (180/Math.PI)
     
      if(a1.length < 1000){
        a1.push(i)
        console.log(a1.length)
      }
      if(a1.length === 1000){
        setIncliAccuracy(a1.reduce((a,b)=>a += b,0)/a1.length)
      }     
      setInclinacao(i);
    })
  }
  function _Magnetometer(){
    Magnetometer.setUpdateInterval(UpdateInterval)
    Magnetometer.addListener(e => {
      const {x,y,z} = e
      const n = 90 - Math.atan2(y,x) * (180/Math.PI) 
      if(a2.length < 1000){
        a2.push(n)
        console.log(a2.length)
      }
      if(a2.length === 1000){
        setNorteAccuracy(a2.reduce((a,b)=>a += b,0)/a2.length)
      }  
      setNorte(n);
    })
  }

  useEffect(() => {
    _Accelerometer()
    _Magnetometer()
  });
  
  const freq = 500
  return (
    <View style={styles.container}>
      <Text>
      Norte: {useNorte}  
      </Text>
      <Text>
      Accuracy Norte: {useNorteAccuracy}
      </Text>
     
      <Text>
      Inclinação: {useInclinacao}
      </Text>
      <Text>
      Accuracy Inclinação: {useIncliAccuracy}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
