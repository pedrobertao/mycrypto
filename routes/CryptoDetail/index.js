import React, { useState, useEffect } from 'react'
import { Image, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native'
import { Path } from 'react-native-svg'
import { AreaChart } from 'react-native-svg-charts'
import dayjs from 'dayjs'

import { Container, Text, View, systemColors } from '../../components/elements'
// import MyCrypto from '../../services/coins'
import coinGecko from '../../services/coingecko'
import NotificationServices from '../../services/notification'

const CryptoDetail = props => {
  const crypto = props.navigation.getParam('crypto', {})

  const [chartData, setMarketChart] = useState({ from: 'day', prices: [], loading: true })

  const [followValues, setFollowValues] = useState({ high: crypto.current_price, low: crypto.current_price })

  const options = ['hour', 'day', 'week']

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
      stroke={systemColors.green}
      fill={'none'}
    />
  )

  return (
    <Container>
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Text>Voltar</Text>
      </TouchableOpacity>
      <View style={{ paddingVertical: 50 }} align='center'>
        <Image source={{ uri: crypto.image }} style={{ height: 50, width: 50 }} />
        <Text>
          {crypto.name} <Text>({crypto.symbol.toUpperCase()})</Text>
        </Text>
        <Text>{crypto.current_price}$</Text>
        <Text size={16} style={{ color: crypto.price_change_percentage_24h > 0 ? '#59ebff' : '#fc1e51' }}>{crypto.price_change_percentage_24h.toFixed(2)}%</Text>
      </View>

      {chartData.loading && <ActivityIndicator />}
      <AreaChart
        style={{ height: 200 }}
        data={chartData.prices}
        xAccessor={({ index }) => index}
        yAccessor={({ item }) => item[1]}
        contentInset={{ top: 30, bottom: 30 }}
        svg={{ fill: 'rgba(179, 255, 229, 0.2)' }}
      >
        <Line />
      </AreaChart>
      <View style={{ marginVertical: 10 }} row justify='space-around'>
        {options.map(option => (
          <TouchableOpacity onPress={() => setMarketChart({ ...chartData, from: option })} key={option}>
            <View style={{ width: '100%', padding: 5 }}>
              <Text style={{ color: option === chartData.from ? systemColors.green : 'rgba(255,255,255,0.2)' }}>1 {option.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View>
        <Text size={14} style={{ color: '#ffe7a3' }}>Total Volume  {crypto.total_volume}</Text>
        <Text size={14} style={{ color: '#ffe7a3' }}>Circulating Supply  {crypto.circulating_supply}</Text>
        <Text size={14} style={{ color: '#ffe7a3' }}>Market Cap  {crypto.market_cap}</Text>
      </View>

      <TouchableOpacity style={{
        borderColor: 'grey',
        borderRadius: 5,
        backgroundColor: systemColors.background,
        borderWidth: 1,
        width: '40%',
        alignSelf: 'center',
        alignItems: 'center'
      }}>
        <Text>FOLLOW</Text>
      </TouchableOpacity>

      <View>
        <Text>Let me know when price hits</Text>

        <Text>High</Text>
        <TextInput
          value={'' + crypto.current_price}
          onChangeText={text => setFollowValues({ ...followValues, high: Number(text) })}
          style={{ backgroundColor: 'grey', height: 30, color: 'black' }}
        />

        <Text>Low</Text>
        <TextInput
          value={'' + crypto.current_price}
          onChangeText={text => setFollowValues({ ...followValues, low: Number(text) })}
          style={{ backgroundColor: 'grey', height: 30, color: 'black' }}
        />

        <TouchableOpacity
          style={{
            borderColor: 'grey',
            borderRadius: 5,
            backgroundColor: systemColors.background,
            borderWidth: 1,
            width: '40%',
            alignSelf: 'center',
            alignItems: 'center'
          }}
          onPress={() => NotificationServices.follow({ id: crypto.id, ...followValues })}
        >
          <Text>SET FOLLOWING</Text>
        </TouchableOpacity>
      </View>

    </Container>
  )
}

export default CryptoDetail
