import React, { useState, useEffect } from 'react'
import { Image, Alert, ScrollView, TouchableOpacity } from 'react-native'
import dayjs from 'dayjs'
import Icon from 'react-native-vector-icons/Feather'
import BigNumber from 'bignumber.js'

import { GradientContainer, Text, View, systemColors } from '../../components/elements'
import { FollowInput, SetButton, CardWrapper } from './styled'
import { Chart, FollowGradient, GraphOption, GraphLoading } from './elements'
// import Wallets from '../../services/coins'
import coinGecko from '../../services/coingecko'
import NotificationServices from '../../services/notification'

const CryptoDetail = props => {
  const crypto = props.navigation.getParam('crypto', {})
  const options = ['hour', 'day', 'week']

  const smallCurrent = new BigNumber(crypto.current_price).precision(4)
  const [currentPrice, setCurrentPrice] = useState(crypto.current_price)
  const [chartData, setMarketChart] = useState({ from: 'day', prices: [], loading: true })
  const [followValues, setFollowValues] = useState({ high: smallCurrent + '', low: smallCurrent + '' })
  const [isFollowing, setIsFollowing] = useState(NotificationServices.isFollowing(crypto.id))

  const priceListener = (type, data) => {
    if (type !== 'fetch') return
    const thisCoin = data.find(d => d.id === crypto.id)
    if (thisCoin.current_price !== currentPrice) setCurrentPrice(thisCoin.current_price)
  }

  const getPrices = async (id, fromLabel) => {
    const to = dayjs().unix()
    const from = dayjs(dayjs()).subtract(1, fromLabel).unix()

    try {
      setMarketChart(chartData => ({ ...chartData, loading: true }))
      const { prices } = await coinGecko.getCoinStats(id, from, to)
      setMarketChart(chartData => ({ ...chartData, prices, loading: false }))
    } catch (error) {
      console.log('====>Error Data', error, error.message)
      setMarketChart(chartData => ({ ...chartData, loading: false }))
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

        <View marginX={20} marginY={10} align='center' justify='space-between' row>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Icon color={systemColors.white} size={25} name='arrow-left' />
          </TouchableOpacity>
          <Text font='bold' size={20}>{crypto.name}  ({crypto.symbol.toUpperCase()})</Text>
          <TouchableOpacity onPress={() => Alert.alert('Carteiras', 'Em breve')}>
            <Icon color={systemColors.white} size={20} name='credit-card' />
          </TouchableOpacity>
        </View>

        <View paddingY={20} align='center'>
          <Image source={{ uri: crypto.image }} style={{ height: 50 * 0.8, width: 50 * 0.8 }} />
          <Text style={{ marginTop: 5 }}>{currentPrice}$</Text>
          <Text size={16} style={{ color: crypto.price_change_percentage_24h > 0 ? systemColors.blue : systemColors.lightRed }}>
            {crypto.price_change_percentage_24h.toFixed(2)}%
          </Text>
        </View>
        <View paddingX={30}>
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

        <GraphLoading loading={chartData.loading} />

        <Chart data={chartData.prices} />
        <View style={{ marginVertical: 5 }} row justify='space-around'>
          {options.map(option => (
            <TouchableOpacity
              onPress={() => setMarketChart({ ...chartData, from: option })}
              key={`graph_${option}`}>
              <GraphOption selected={option === chartData.from}>
                {option.toUpperCase()}
              </GraphOption>
            </TouchableOpacity>
          ))}
        </View>

        <View height={50 / 2} />
        <View flex={1} row justify='center'>
          <TouchableOpacity
            onPress={onFollow}
            style={{
              width: '40%',
              alignItems: 'center',
              marginBottom: 5
            }}>
            <Icon
              name={isFollowing ? 'eye-off' : 'eye'}
              color={systemColors.secondary}
              size={32 * 0.8}
            />
            <Text size={10}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
          </TouchableOpacity>
        </View>

        {isFollowing && (
          <View row justify='center'>
            <CardWrapper>
              <FollowGradient />
              <View align='center' justify='space-between' row>
                <Text size={14} font='regular' secondary>High</Text>
                <FollowInput
                  value={followValues.high}
                  onChangeText={high => setFollowValues(followValues =>
                    ({ ...followValues, high }))}
                  editable={isFollowing}
                />
              </View>
              <View height={15} />
              <View align='center' justify='space-around' row>
                <Text size={14} font='regular' secondary>Low</Text>
                <FollowInput
                  value={followValues.low}
                  onChangeText={low => setFollowValues(followValues =>
                    ({ ...followValues, low }))}
                  editable={isFollowing}
                />
              </View>
            </CardWrapper>
            <SetButton
              onPress={followCurrentValues}>
              <Text size={14}>SET</Text>
            </SetButton>
          </View>
        )}
      </ScrollView>
    </GradientContainer>
  )
}

export default CryptoDetail
