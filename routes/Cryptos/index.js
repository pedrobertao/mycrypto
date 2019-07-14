/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import includes from 'lodash/includes'
import LinearGradient from 'react-native-linear-gradient'

import { Container, View, Text, systemColors } from '../../components/elements'
import CryptoItem from './item'

import coinGecko from '../../services/coingecko'

const myCoins = [
  'bitcoin', 'tron', 'ethereum'
]
export default ({ navigation }) => {
  const [coins, setCoins] = useState({
    loading: true,
    myCoins: [],
    otherCoins: [],
    error: false
  })
  useEffect(() => {
    setCoins({ loading: true });
    (async () => {
      try {
        const cryptoCoins = await coinGecko.getCoins()
        // const cryptoCoins = require('./mockCrypto.json')
        setCoins({
          loading: false,
          myCoins: cryptoCoins.filter(c => includes(myCoins, c.id)),
          otherCoins: cryptoCoins.filter(c => !includes(myCoins, c.id))
        })
      } catch (error) {
        console.warn('====>', error.message)
        setCoins({ loading: false, error: true })
      }
    })()
  }, [])

  const navigateToDetail = crypto => navigation.navigate('detail', { crypto })

  const renderItem = ({ item, index }) => (
    <CryptoItem
      item={item}
      index={index}
      onPress={navigateToDetail.bind(null, item)}
    />
  )

  return (
    <LinearGradient
      colors={['#25304C', '#121722']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ height: '100%',
        width: '100%',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0 }}>
      <Container background='transparent'>
        <Text font='regular' style={{
          fontSize: 20,
          textAlign: 'center',
          margin: 10,
          color: systemColors.white
        }}>MINHA CRYPTO</Text>
        <View style={{ flex: 1, paddingHorizontal: 30 }}>
          <Text>Minhas Cryptos</Text>
          <View flex={0.5}>
            <FlatList
              keyExtractor={item => item.id}
              data={coins.myCoins}
              renderItem={renderItem}
            />
          </View>
          <Text>Outras Cryptos</Text>
          <View flex={0.5}>
            <FlatList
              keyExtractor={item => item.id}
              data={coins.otherCoins}
              renderItem={renderItem}
            />
          </View>

        </View>
      </Container>
    </LinearGradient>
  )
}
