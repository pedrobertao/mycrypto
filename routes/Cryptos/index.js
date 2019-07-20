/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from 'react'
import { FlatList } from 'react-native'

import { GradientContainer, Container, View, Text, systemColors } from '../../components/elements'
import CryptoItem from './item'
import coinGecko from '../../services/coingecko'

import UserCoins from '../../services/notification/coinsRealm'

UserCoins.init()
export default ({ navigation }) => {
  const [coins, setCoins] = useState({
    loading: true,
    myCoins: [],
    otherCoins: [],
    error: false
  })

  const updateCoins = async () => {
    setCoins({ loading: true })
    try {
      console.log('=======>Changing coin')
      const coins = UserCoins.getCoins()
      const cryptoCoins = await coinGecko.getCoins()
      // const cryptoCoins = require('./mockCrypto.json')
      setCoins({
        loading: false,
        myCoins: cryptoCoins.filter(c => !!coins[c.id]),
        otherCoins: cryptoCoins.filter(c => !coins[c.id]),
        error: false
      })
      // navigateToDetail(cryptoCoins[0])
    } catch (error) {
      console.warn('====>', error.message)
      setCoins({ loading: false, error: true })
    }
  }

  useEffect(() => {
    // navigation.addListener('didFocus', updateCoins)
    updateCoins()
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
