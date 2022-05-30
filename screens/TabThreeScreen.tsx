import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Magnetometer } from 'expo-sensors';

const data = []
export default function TabThreeScreen() {

  const [useN,setN] = useState(0)

  const [useI,setI] = useState(0)
  
  const [UpdateInterval] = useState(100)

  function _Accelerometer(){
    Accelerometer.setUpdateInterval(UpdateInterval)
    let iRadiano = 0
    Accelerometer.addListener(e => {
      const {x,y,z} = e  
      iRadiano =  Math.atan2(y,z) 
      const iGraus = iRadiano * (180/Math.PI)
      setI(iRadiano);
    })

  }
  
  async function _Magnetometer(){
    Magnetometer.setUpdateInterval(UpdateInterval)
    let nRadiano = 0
    
    Magnetometer.addListener(e => {
      const {x,y,z} = e
    
      nRadiano = 90 * Math.PI/180 - Math.atan2(y,x)
      setN(nRadiano);
    })    
  }

  function _start({useN,useI}){

    const atual : { x: number, y: number, z: number , a: number , w: number} = {
      x : 0,
      y : 0,
      z : 0,
      a : 0,
      w : 0
    }
    const distancia = 1000
    // Xi= X n-1 ± [ Sen(ω(n-1)-ωn) * Cos(α) ]* D
    // Yi=Y n-1 +[ Cos(ω(n-1)-ωn) * Cos(α) ]* D
    // Zi= Z n-1 + D * Sen(α)
    let anterior = 0
    if(data[data.length-1]){
       anterior = data[data.length-1]
    }else{
      anterior = atual
    }
    
    atual.a = useI
    atual.w = useN

    const alteracaoX = (Math.sin(anterior.w - atual.w)  *  Math.cos(atual.a) ) * distancia 
    const alteracaoY = ( Math.cos(anterior.w - atual.w)  *  Math.cos(atual.a) ) * distancia
    const alteracaoZ = ( Math.sin(atual.a)) * distancia

    if(
      alteracaoX > 50 || alteracaoX < -50 
      && alteracaoZ > 10 || alteracaoZ < -10 
      && distancia - alteracaoY> 1 || distancia - alteracaoY < -1 
      )
    {
      console.log('x: ',alteracaoX,'y: ',distancia-alteracaoY,'z: ', alteracaoZ)
      
      atual.x = Math.round(  anterior.x + alteracaoX )
      atual.y = Math.round( anterior.y +  alteracaoY)
      atual.z = Math.round( anterior.z + alteracaoZ )
      data.push(atual)
      console.log(atual)
    }
  }
  useEffect(() => {
    _Accelerometer()
    _Magnetometer()
    _start({useN,useI})
  }),[useN,useI];
  
  const freq = 500
  return (
    <View style={styles.container}>
      <Text>
      Norte: {useN * (180/Math.PI)}  
      </Text>

      <Text>
      Inclinação: {useI * (180/Math.PI)}
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
