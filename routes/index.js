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
