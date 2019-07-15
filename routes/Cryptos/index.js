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

import { GradientContainer, Container, View, Text, systemColors } from '../../components/elements'
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
        // const cryptoCoins = await coinGecko.getCoins()
        const cryptoCoins = require('./mockCrypto.json')
        setCoins({
          loading: false,
          myCoins: cryptoCoins.filter(c => includes(myCoins, c.id)),
          otherCoins: cryptoCoins.filter(c => !includes(myCoins, c.id))
        })
        navigateToDetail(cryptoCoins[0])
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
    <GradientContainer>
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
    </GradientContainer>
  )
}
