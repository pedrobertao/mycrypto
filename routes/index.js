import { PushNotificationIOS } from 'react-native'
import { createAppContainer, createStackNavigator } from 'react-navigation'
import PushNotification from 'react-native-push-notification'
import Reactotron from 'reactotron-react-native'

import Cryptos from './Cryptos'
import CryptoDetail from './CryptoDetail'

Reactotron
  .configure({
    enabled: true,
    host: '192.168.0.12' // server ip
  })
  .useReactNative()
  .connect()

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
