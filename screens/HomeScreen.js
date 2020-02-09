import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Picker,
  TouchableOpacity,
  Animated
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polyline } from 'react-native-maps';
import { map, range, get } from 'lodash';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'react-native-elements';
import allPositions from '../stores/data';

const MainMapView = React.memo(function MemoMapView({selectedPatient, selectPositions}){

  return(
    <MapView
        key={1}
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       region={{
        latitude: 35.7774758,
        longitude: 128.0972132,
        latitudeDelta: 5,
        longitudeDelta: 5,
      }}
      // onRegionChange={setRegion}
     >
      {
        map(selectPositions, (positions, index) => {
          return map(positions, (position, index1) => (
          <Marker
            key={index+''+index1+''+position.date+''+position.title+''+position.latlng[0]+ '' + position.latlng[1]}
            coordinate={
              {
                latitude: position.latlng[0],
                longitude: position.latlng[1]
              }
            }
            //https://github.com/react-native-community/react-native-maps/issues/1895
            zIndex={index}
          >
            <View 
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: index1 === positions.length - 1 ? 'white' : position.color,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {
                index1 === positions.length - 1 &&
                <Icon reverse type='material' name='local-hospital' color='red' size={20} style={{borderRadius: 10}}/>
              }
              {
                index1 !== positions.length - 1 &&
                <Text style={{fontWeight: 'bold', color: 'white'}}>{selectedPatient ? selectedPatient : index + 1}</Text>
              }
            </View>
            <Callout>
              <View style={{backgroundColor: 'white', width: 100}}>
                <Text>{position.title}</Text>
                <Text>{position.date}</Text>
                <Text>{position.address}</Text>
              </View>
            </Callout>
          </Marker>))
        })
      }
      {
        selectedPatient > 0 &&
        <Polyline
          coordinates={
            map(selectPositions[0], position => ({
              latitude: position.latlng[0],
              longitude: position.latlng[1]
            }))
          }
          strokeColor={selectPositions[0][0].color}
        />
      }
     </MapView>
  )
})

function InfectedInfo({showPatientList, setShowPatientList, selectedPatient, setSelectedPatient, size}){
  const [animated] = useState(new Animated.Value(150));

  useEffect(() => {
    if(showPatientList){
      Animated.timing(
        animated,
        {
          toValue: 300,
          time: 1000
        }
      ).start();
    }else{
      Animated.timing(
        animated,
        {
          toValue: 130,
          time: 1000
        }
      ).start();
    }
  }, [showPatientList]);

  return(
    <Animated.View
        style={{
          width: 80,
          height: animated,
          zIndex: 100,
          position: 'absolute',
          top: 20,
          right: 0,
          backgroundColor: 'white',
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          padding: 10,
        }}
      >
        <View style={{alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold'}}>확진자</Text>
          <Text style={{fontSize: 20, paddingVertical: 10}}>27</Text>
          <Text style={{fontWeight: 'bold'}}>완치</Text>
          <Text style={{fontWeight: 'bold'}}>3명</Text>
          <TouchableOpacity style={{paddingVertical: 5, width: '100%'}} onPress={() => setShowPatientList(!showPatientList)}>
            <Icon name={showPatientList ? 'expand-less' : 'expand-more'} color='black' size={24}/>
          </TouchableOpacity>
        </View>

        {
          showPatientList &&
          <ScrollView>
              <TouchableOpacity key={0} style={{padding: 5}} onPress={() => setSelectedPatient(0)}>
                <Text style={{textAlign: 'center', fontWeight: selectedPatient === 0 ? 'bold' : 'normal'}}>전체</Text>
              </TouchableOpacity>
              {
                range(1, size + 1).map(index => (
                  <TouchableOpacity key={index} style={{padding: 5}} onPress={() => setSelectedPatient(index)}>
                    <Text style={{textAlign: 'center', fontWeight: selectedPatient === index ? 'bold' : 'normal'}}>{`${index}번째`}</Text>
                  </TouchableOpacity>
                ))
              }
          </ScrollView>
        }
      </Animated.View>
  )
}

function SuspectedInfo(){
  const [showSuspection, setShowSuspection] = useState(null)

  return(
    <Animated.View
        style={{
          width: 80,
          // height: animated,
          zIndex: 99,
          position: 'absolute',
          top: 160,
          right: 0,
          backgroundColor: 'white',
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          padding: 10,
        }}
      >
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{fontWeight: 'bold'}}>유증상자</Text>
          <Text style={{fontSize: 20, paddingVertical: 10}}>2,571</Text>
          <TouchableOpacity style={{paddingVertical: 5, width: '100%'}} onPress={() => setShowSuspection(!showSuspection)}>
            <Icon name={showSuspection ? 'expand-less' : 'expand-more'} color='black' size={24}/>
          </TouchableOpacity>
        </View>
        
        {
          showSuspection &&
          <View style={{alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>격리해제</Text>
            <Text style={{}}>1,683명</Text>
            <Text style={{fontWeight: 'bold'}}>격리 중</Text>
            <Text style={{}}>888명</Text>
          </View>
        }
      </Animated.View>
  )
}

function HomeScreen() {
  const [selectedPatient, setSelectedPatient] = useState(0);
  const [selectPositions, setSelectedPositions] = useState(null);
  const [showPatientList, setShowPatientList]= useState(false);

  useEffect(() => {
   if(selectedPatient === 0){
    setSelectedPositions(allPositions);
   }else{
    setSelectedPositions([allPositions[selectedPatient - 1]]);
   }
  }, [selectedPatient]);

  return (
    <View style={styles.container}>
      <InfectedInfo
        showPatientList={showPatientList}
        setShowPatientList={setShowPatientList}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
        size={allPositions.length}
      />

      <SuspectedInfo />

      <MainMapView selectedPatient={selectedPatient} selectPositions={selectPositions}/>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

export default inject('AppStore')(observer(HomeScreen))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },  
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
