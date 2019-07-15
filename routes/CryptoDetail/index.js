import React, { useState, useEffect } from 'react'
import { Image, ActivityIndicator, Alert, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { AreaChart } from 'react-native-svg-charts'
import dayjs from 'dayjs'
import Icon from 'react-native-vector-icons/Feather'
import BigNumber from 'bignumber.js'
import { Path, Defs, LinearGradient as LinearGradientSvg, Stop } from 'react-native-svg'
import LinearGradient from 'react-native-linear-gradient'

import { GradientContainer, Text, View, systemColors } from '../../components/elements'
// import MyCrypto from '../../services/coins'
import coinGecko from '../../services/coingecko'
import NotificationServices from '../../services/notification'

const CryptoDetail = props => {
  const crypto = props.navigation.getParam('crypto', {})
  const options = ['hour', 'day', 'week']

  const [chartData, setMarketChart] = useState({ from: 'day', prices: [], loading: true })
  const [followValues, setFollowValues] = useState({ high: crypto.current_price + '', low: crypto.current_price + '' })
  const [isFollowing, setIsFollowing] = useState(NotificationServices.isFollowing)

  useEffect(() => {
    const getPrices = async (id, fromLabel) => {
      const to = dayjs().unix()
      const from = dayjs(dayjs()).subtract(1, fromLabel).unix()

      try {
        setMarketChart({ ...chartData, loading: true })
        const { data } = await coinGecko.get(`/coins/${id}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`)
        console.log('====> Data', data)
        setMarketChart({ ...chartData, prices: data.prices, loading: false })
      } catch (error) {
        console.log('====>Error Data', error, error.message)
        setMarketChart({ ...chartData, loading: false })
      }
    }
    getPrices(crypto.id, chartData.from)
  }, [chartData.from])

  const Line = ({ line }) => (
    <Path
      key={'line'}
      d={line}
      // stroke='#61cac8'
      stroke={systemColors.secondary}
      fill={'none'}
    />
  )
  const Gradient = ({ index }) => (
    <Defs key={index}>
      <LinearGradientSvg id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'20%'}>
        <Stop offset='0%' stopColor={systemColors.secondary} stopOpacity={0.2} />
        <Stop offset='50%' stopColor={systemColors.secondary} stopOpacity={0} />
      </LinearGradientSvg>
    </Defs>
  )

  console.log('=====>', isFollowing)
  return (
    <GradientContainer>
      <ScrollView>
        <View style={{ marginHorizontal: 20, marginVertical: 10 }} align='center' justify='space-between' row>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Icon color={systemColors.white} size={25} name='arrow-left' />
          </TouchableOpacity>
          <Text font='bold' size={20}>{crypto.name}  ({crypto.symbol.toUpperCase()})</Text>
          <Icon color={systemColors.white} size={20} name='refresh-ccw' />
        </View>

        <View style={{ paddingVertical: 20 }} align='center'>
          <Image source={{ uri: crypto.image }} style={{ height: 50, width: 50 }} />
          <Text style={{ marginTop: 5 }}>{crypto.current_price}$</Text>
          <Text size={16} style={{ color: crypto.price_change_percentage_24h > 0 ? systemColors.blue : systemColors.lightRed }}>
            {crypto.price_change_percentage_24h.toFixed(2)}%
          </Text>
        </View>
        <View style={{ paddingHorizontal: 30 }}>
          <View row justify='space-between'>
            <Text size={12}>Market Cap</Text>
            <Text secondary>{new BigNumber(crypto.market_cap).toFormat()}</Text>
          </View>
          <View row justify='space-between' align='center'>
            <Text size={12}>Total Volume</Text>
            <Text secondary>{new BigNumber(crypto.total_volume).toFormat()}</Text>
          </View>
          <View row justify='space-between'>
            <Text size={12}>Circulating Supply</Text>
            <Text secondary>{new BigNumber(crypto.circulating_supply).toFormat()}</Text>
          </View>
        </View>

        {chartData.loading && <ActivityIndicator />}
        <AreaChart
          style={{ height: 200 }}
          data={chartData.prices}
          xAccessor={({ index }) => index}
          yAccessor={({ item }) => item[1]}
          contentInset={{ top: 30, bottom: 30 }}
          svg={{ fill: 'url(#gradient)' }}
        >
          <Line />
          <Gradient />
        </AreaChart>
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
        <View justify='space-around' row>
          <TouchableOpacity
            onPress={() => {
              setIsFollowing(!isFollowing)
            }}
            style={{
              width: '40%',
              alignSelf: 'center',
              alignItems: 'center'
            }}>
            <Icon name={isFollowing ? 'eye-off' : 'eye'} color={systemColors.white} size={32} />
            <Text secondary size={10}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert.alert('Soon', 'Work in progress')
            }}
            style={{
              width: '40%',
              alignSelf: 'center',
              alignItems: 'center'
            }}>
            <Icon name='globe' color={systemColors.white} size={32} />
            <Text secondary size={10}>Trade</Text>
          </TouchableOpacity>
        </View>

        <View height={10} />

        {isFollowing && (
          <LinearGradient
            colors={['#232639', '#212838']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              padding: 10,
              marginHorizontal: 60,
              borderRadius: 4,
              marginVertical: 5
            }}
          >
            <Text font='regular' size={12} style={{ alignSelf: 'center' }}>Let me know when price is</Text>
            <View height={10} />
            <View>
              <View align='center' justify='space-around' row>
                <Text secondary>High</Text>
                <TextInput
                  value={followValues.high}
                  onChangeText={text => setFollowValues({ ...followValues, high: Number(text) })}
                  style={{
                    height: 30,
                    color: systemColors.white,
                    borderBottomWidth: 1,
                    borderBottomColor: systemColors.blue,
                    width: 100,
                    fontSize: 16,
                    textAlign: 'center'
                  }}
                  underlineColorAndroid='transparent'
                />
              </View>
              <View height={15} />
              <View align='center' justify='space-around' row>
                <Text secondary>Low</Text>
                <TextInput
                  value={followValues.low}
                  onChangeText={text => setFollowValues({ ...followValues, low: Number(text) })}
                  style={{
                    height: 30,
                    color: systemColors.white,
                    borderBottomWidth: 1,
                    borderBottomColor: systemColors.blue,
                    width: 100,
                    fontSize: 16,
                    textAlign: 'center'
                  }}
                  underlineColorAndroid='transparent'
                />
              </View>
            </View>
            <View height={20} />
            <View align='center'>
              <TouchableOpacity
                onPress={() => {
                  NotificationServices.follow({ id: crypto.id, ...followValues })
                  setIsFollowing(false)
                }}
              >
                <Icon name='check' size={28} color={systemColors.green} />
              </TouchableOpacity>
            </View>

          </LinearGradient>
        )}
      </ScrollView>

    </GradientContainer>
  )
}

export default CryptoDetail
