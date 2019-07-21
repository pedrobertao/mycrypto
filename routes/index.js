/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { PushNotificationIOS } from 'react-native'
import { createAppContainer, createStackNavigator, createDrawerNavigator } from 'react-navigation'
import Cryptos from './Cryptos'
import CryptoDetail from './CryptoDetail'
import Reactotron from 'reactotron-react-native'
import PushNotification from 'react-native-push-notification'

Reactotron
  .configure({
    enabled: true,
    host: '192.168.0.12' // server ip
  }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!

console.log = (...msg) => Reactotron.display({
  name: 'MyCrypto',
  value: msg,
  preview: msg[0]
})

const cryptoStack = createStackNavigator({
  list: Cryptos,
  detail: CryptoDetail
}, {
  headerMode: 'none'
})

// const drawerNavigator = createDrawerNavigator({
//   home: cryptoStack
// })

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token)
  },
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification)
    notification.finish(PushNotificationIOS.FetchResult.NoData)
  },
  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,
  requestPermissions: true
})

export default createAppContainer(cryptoStack)
