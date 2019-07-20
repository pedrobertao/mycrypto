import React, { useState, useEffect } from 'react'
import { Image, Alert, ActivityIndicator, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import dayjs from 'dayjs'
import Icon from 'react-native-vector-icons/Feather'
import BigNumber from 'bignumber.js'
import LinearGradient from 'react-native-linear-gradient'

import { GradientContainer, Text, View, systemColors } from '../../components/elements'
// import MyCrypto from '../../services/coins'
import coinGecko from '../../services/coingecko'
import NotificationServices from '../../services/notification'
import { Chart } from './elements'

const CryptoDetail = props => {
  const crypto = props.navigation.getParam('crypto', {})
  const options = ['hour', 'day', 'week']

  const [currentPrice, setCurrentPrice] = useState(crypto.current_price)
  const [chartData, setMarketChart] = useState({ from: 'day', prices: [], loading: true })
  const [followValues, setFollowValues] = useState({ high: crypto.current_price + '', low: crypto.current_price + '' })
  const [isFollowing, setIsFollowing] = useState(NotificationServices.isFollowing(crypto.id))

  const priceListener = data => {
    const thisCoin = data.find(d => d.id === crypto.id)
    if (thisCoin.current_price !== currentPrice) setCurrentPrice(thisCoin.current_price)
  }

  const getPrices = async (id, fromLabel) => {
    const to = dayjs().unix()
    const from = dayjs(dayjs()).subtract(1, fromLabel).unix()

    try {
      setMarketChart({ ...chartData, loading: true })
      const { data } = await coinGecko.get(`/coins/${id}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`)
      setMarketChart({ ...chartData, prices: data.prices, loading: false })
    } catch (error) {
      console.log('====>Error Data', error, error.message)
      setMarketChart({ ...chartData, loading: false })
    }
  }

  useEffect(() => {
    NotificationServices.addListener(priceListener)
    getPrices(crypto.id, chartData.from)
    return () => {
      NotificationServices.removeListener(priceListener)
    }
  }, [chartData.from])

  const onFollow = () => {
    setIsFollowing(!isFollowing)
    if (isFollowing) {
      NotificationServices.unfollow(crypto.id)
    } else {
      NotificationServices.follow({ id: crypto.id })
    }
  }

  const followCurrentValues = () => (
    NotificationServices.follow({
      id: crypto.id,
      high: followValues.high,
      low: followValues.low
    })
  )

  return (
    <GradientContainer>
      <ScrollView>

        <View style={{ marginHorizontal: 20, marginVertical: 10 }} align='center' justify='space-between' row>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Icon color={systemColors.white} size={25} name='arrow-left' />
          </TouchableOpacity>
          <Text font='bold' size={20}>{crypto.name}  ({crypto.symbol.toUpperCase()})</Text>
          <TouchableOpacity onPress={() => Alert.alert('Carteiras', 'Em breve')}>
            <Icon color={systemColors.white} size={20} name='credit-card' />
          </TouchableOpacity>
        </View>

        <View style={{ paddingVertical: 20 }} align='center'>
          <Image source={{ uri: crypto.image }} style={{ height: 50, width: 50 }} />
          <Text style={{ marginTop: 5 }}>{currentPrice}$</Text>
          <Text size={16} style={{ color: crypto.price_change_percentage_24h > 0 ? systemColors.blue : systemColors.lightRed }}>
            {crypto.price_change_percentage_24h.toFixed(2)}%
          </Text>
        </View>
        <View style={{ paddingHorizontal: 30 }}>
          <View row justify='space-between' align='center'>
            <Text size={12}>Market Cap</Text>
            <Text secondary>{new BigNumber(crypto.market_cap).toFormat()}</Text>
          </View>
          <View row justify='space-between' align='center'>
            <Text size={12}>Total Volume</Text>
            <Text secondary>{new BigNumber(crypto.total_volume).toFormat()}</Text>
          </View>
          <View row justify='space-between' align='center'>
            <Text size={12}>Circulating Supply</Text>
            <Text secondary>{new BigNumber(crypto.circulating_supply).toFormat()}</Text>
          </View>
        </View>

        {chartData.loading && <ActivityIndicator />}
        <Chart data={chartData.prices} />
        <View style={{ marginVertical: 5 }} row justify='space-around'>
          {options.map(option => (
            <TouchableOpacity onPress={() => setMarketChart({ ...chartData, from: option })} key={option}>
              <View style={{ width: '100%', padding: 5 }}>
                <Text style={{ color: option === chartData.from ? systemColors.blue : 'rgba(255,255,255,0.2)' }}>1 {option.toUpperCase()}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View height={50} />
        <View flex={1} row justify='center'>
          <TouchableOpacity
            onPress={onFollow}
            style={{
              width: '40%',
              alignItems: 'center',
              marginBottom: 5
            }}>
            <Icon name={isFollowing ? 'eye-off' : 'eye'} color={systemColors.secondary} size={32} />
            <Text size={10}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
          </TouchableOpacity>
        </View>

        {isFollowing &&
        <View row justify='center'>
          <View
            style={{
              height: 110,
              padding: 15,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: systemColors.secondary,
              marginVertical: 5,
              justifyContent: 'center'
            }}
          >
            <LinearGradient
              colors={['#232639', '#495b85']}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 4, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />

            <View align='center' justify='space-between' row>
              <Text size={14} font='regular' secondary>High</Text>
              <TextInput
                value={followValues.high}
                onChangeText={high => setFollowValues({ ...followValues, high })}
                style={{
                  height: 30,
                  color: systemColors.white,
                  borderBottomWidth: 1,
                  borderBottomColor: systemColors.blue,
                  width: 70,
                  marginHorizontal: 15,
                  fontSize: 16,
                  textAlign: 'center'
                }}
                underlineColorAndroid='transparent'
                returnKeyType='done'
                editable={isFollowing}
                keyboardType='numeric'
              />
            </View>
            <View height={15} />
            <View align='center' justify='space-around' row>
              <Text size={14} font='regular' secondary>Low</Text>
              <TextInput
                value={followValues.low}
                onChangeText={low => setFollowValues({ ...followValues, low })}
                style={{
                  height: 30,
                  color: systemColors.white,
                  borderBottomWidth: 1,
                  borderBottomColor: systemColors.blue,
                  width: 70,
                  marginHorizontal: 15,
                  fontSize: 16,
                  textAlign: 'center'
                }}
                keyboardType='numeric'
                returnKeyType='done'
                editable={isFollowing}
                underlineColorAndroid='transparent'
              />
            </View>
            <TouchableOpacity
              onPress={followCurrentValues}
              style={{ backgroundColor: systemColors.secondary,
                padding: 5,
                color: systemColors.secondary,
                position: 'absolute',
                borderRadius: 6,
                alignItems: 'center',
                zIndex: 10,
                width: 45,
                right: -25,
                top: 35 }}>
              <Text size={14}>SET</Text>
            </TouchableOpacity>
          </View>
        </View>
        }
      </ScrollView>
    </GradientContainer>
  )
}

export default CryptoDetail
