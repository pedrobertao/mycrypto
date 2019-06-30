/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { createAppContainer, createStackNavigator, createDrawerNavigator } from 'react-navigation'
import Cryptos from './Cryptos'
import CryptoDetail from './CryptoDetail'
import Reactotron from 'reactotron-react-native'

Reactotron
  .configure() // controls connection & communication settings
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

const drawerNavigator = createDrawerNavigator({
  home: cryptoStack
})

export default createAppContainer(drawerNavigator)
