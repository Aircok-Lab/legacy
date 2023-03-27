import React, { Component } from 'react';
import { Text, View , Image,Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export default class App extends Component {
  render() {
    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Hello, world111!</Text>
        <Image source={pic} style={{width: 193, height: 110}}/>
      </View>
      
    );
  }
  componentDidMount(){
    messaging().onMessage(async remoteMessage => {
      AppRegistry.registerComponent('app', () => App);
      Alert.alert('Foreground', JSON.stringify(remoteMessage));
    });    
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      //  여기에 로직을 작성한다.
      //  remoteMessage.data로 메세지에 접근가능
      //  remoteMessage.from 으로 topic name 또는 message identifier
      //  remoteMessage.messageId 는 메시지 고유값 id
      //  remoteMessage.notification 메시지와 함께 보내진 추가 데이터
      //  remoteMessage.sentTime 보낸시간
      AppRegistry.registerComponent('app', () => App);
      Alert.alert('backGround', JSON.stringify(remoteMessage));
      });
  }
}