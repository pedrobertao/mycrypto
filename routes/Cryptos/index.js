import React, { useState, useEffect } from 'react'
import { FlatList } from 'react-native'

import { GradientContainer, Container, View, Text, systemColors } from '../../components/elements'
import CryptoItem from './item'
import Notifications from '../../services/notification'
import coinGecko from '../../services/coingecko'

const useCoins = (navigation) => {
  const [coins, setCoins] = useState({
    loading: true,
    coins: [],
    myCoins: [],
    otherCoins: [],
    error: false
  })

  const updateCoins = async (type, cryptoCoins) => {
    if (type !== 'fetch') return
    setCoins(coins => ({ ...coins, loading: true }))
    try {
      // const cryptoCoins = require('./mockCrypto.json')
      const cryptoCoins = await coinGecko.getCoins()
      setCoins(coins => ({
        ...coins,
        loading: false,
        coins: cryptoCoins,
        myCoins: cryptoCoins.filter(c => !!Notifications.coins[c.id]),
        otherCoins: cryptoCoins.filter(c => !Notifications.coins[c.id]),
        error: false
      }))
      // navigation.navigate('detail', { crypto: cryptoCoins[0] })
    } catch (error) {
      setCoins(coins => ({ ...coins, loading: false, error: true }))
    }
  }

  const didFocusUpdate = () => {
    setCoins(prevCoins => ({
      ...prevCoins,
      myCoins: prevCoins.coins.filter(c => !!Notifications.coins[c.id]),
      otherCoins: prevCoins.coins.filter(c => !Notifications.coins[c.id])
    }))
  }

  useEffect(() => {
    navigation.addListener('didFocus', didFocusUpdate)
    Notifications.addListener(updateCoins)
    return () => {
      Notifications.removeListener(updateCoins)
      navigation.removeListener(didFocusUpdate)
    }
  }, [])

  return coins
}

export default ({ navigation }) => {
  const coins = useCoins(navigation)
  const navigateToDetail = crypto => navigation.navigate('detail', { crypto })

  const renderEmptyList = () => (
    <Text secondary>{
      coins.loading
        ? 'Loading coins..'
        : 'Follow your favorite coin bellow'}</Text>
  )

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
        <Text size={20} color={systemColors.white} align='center' font='regular'>
        MY CRYPTO
        </Text>

        <View flex={1} paddingX={30}>
          <Text>My Cryptos</Text>
          <View flex={0.5}>
            <FlatList
              keyExtractor={item => item.id}
              ListEmptyComponent={renderEmptyList}
              data={coins.myCoins}
              renderItem={renderItem}
            />
          </View>
          <Text>More Cryptos</Text>
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
