import React, { useState, useEffect } from 'react'
import { Alert, ScrollView, TouchableOpacity } from 'react-native'
import dayjs from 'dayjs'
import Icon from 'react-native-vector-icons/Feather'

import { GradientContainer, Text, View, systemColors } from '../../components/elements'
import { CardWrapper, CryptoImg } from './styled'
import { Chart, FollowGradient, GraphOption, GraphLoading, FollowValue, MarketStats, FollowIcon } from './elements'
import coinGecko from '../../services/coingecko'
import NotificationServices from '../../services/notification'
import { formatNumber } from '../../utils/format'
// import Wallets from '../../services/coins' soon

const CryptoDetail = props => {
  const crypto = props.navigation.getParam('crypto', {})

  const { high: currentHigh, low: currentLow } = NotificationServices.getCoin(crypto.id)

  const [currentPrice, setCurrentPrice] = useState(formatNumber(crypto.current_price))
  const [chartData, setMarketChart] = useState({ from: 'day', prices: [], loading: true })
  const [isFollowing, setIsFollowing] = useState(NotificationServices.isFollowing(crypto.id))

  const priceListener = (type, data) => {
    if (type !== 'fetch') return
    const thisCoin = data.find(d => d.id === crypto.id)
    setCurrentPrice(formatNumber(thisCoin.current_price))
  }

  const getPrices = async (id, fromLabel) => {
    const to = dayjs().unix()
    const from = dayjs(dayjs()).subtract(1, fromLabel).unix()

    try {
      setMarketChart(chartData => ({ ...chartData, loading: true }))
      const { prices } = await coinGecko.getCoinStats(id, from, to)
      setMarketChart(chartData => ({ ...chartData, prices, loading: false }))
    } catch (error) {
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
      NotificationServices.follow(crypto.id)
    }
  }

  const onSetValues = (type, value) => (
    NotificationServices.setFollowValues({
      id: crypto.id,
      [type]: value
    })
  )

  return (
    <GradientContainer>
      <ScrollView>
        <View marginX={20} marginY={10} align='center' justify='space-between' row>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Icon color={systemColors.white} size={25} name='arrow-left' />
          </TouchableOpacity>
          <Text font='bold' size={20}>
            {crypto.name}  ({crypto.symbol.toUpperCase()})
          </Text>
          <TouchableOpacity onPress={() => Alert.alert('Wallets', '#SOON')}>
            <Icon color={systemColors.white} size={20} name='credit-card' />
          </TouchableOpacity>
        </View>

        <View paddingY={20} align='center'>
          <CryptoImg source={{ uri: crypto.image }} />
          <Text>{currentPrice} $</Text>
          <Text size={16} variation={crypto.price_change_percentage_24h}>
            {crypto.price_change_percentage_24h.toFixed(2)}%
          </Text>
        </View>
        <View paddingX={30}>
          <MarketStats
            label='Market Cap'
            value={crypto.market_cap}
          />
          <MarketStats
            label='Total Volume'
            value={crypto.total_volume}
          />
          <MarketStats
            label='Circulating Supply'
            value={crypto.circulating_supply}
          />
        </View>

        <GraphLoading loading={chartData.loading} />

        <Chart data={chartData.prices} />
        <View marginY={5} row justify='space-around'>
          {coinGecko.STATS_OPTIONS.map(option => (
            <TouchableOpacity
              onPress={() => setMarketChart({ ...chartData, from: option })}
              key={`graph_${option}`}>
              <GraphOption selected={option === chartData.from}>
                {option}
              </GraphOption>
            </TouchableOpacity>
          ))}
        </View>

        <View height={25} />

        <View flex={1} row justify='center'>
          <FollowIcon onPress={onFollow} disabled={isFollowing} />
        </View>

        {isFollowing && (
          <View row justify='center'>
            <CardWrapper>
              <FollowGradient />
              <FollowValue
                type='high'
                onSet={onSetValues}
                initialValue={String(currentHigh)}
                id={crypto.id}
              />
              <View height={15} />
              <FollowValue
                type='low'
                onSet={onSetValues}
                initialValue={String(currentLow)}
                id={crypto.id}
              />
            </CardWrapper>
          </View>
        )}
      </ScrollView>
    </GradientContainer>
  )
}

export default CryptoDetail
