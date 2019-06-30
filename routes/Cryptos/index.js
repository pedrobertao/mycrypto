/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { Text, ListItem, Thumbnail, Left, Body, Right } from 'native-base'
import { LinearGradient, Defs, Stop } from 'react-native-svg'
import { LineChart, Grid } from 'react-native-svg-charts'
import BigNumber from 'bignumber.js'
import { Container } from '../../components/elements'
import coinGecko from '../../services/coingecko'

const MAINCOLOR = '#4cff9c'

// export default class App extends Component {
//   render () {
//     return (
//       <SafeAreaView style={{ flex: 1 }}>
//         <Text style={styles.welcome}>Welcome to React Native!</Text>
//         <Text style={styles.instructions}>To get started, edit App.js</Text>
//       </SafeAreaView>
//     )
//   }
// }

export default ({ navigation }) => {
  const [coinData, setCoin] = useState({
    loading: true,
    data: [],
    error: false
  })

  useEffect(() => {
    setCoin({ loading: true });
    (async () => {
      try {
        // const { data } = await coinGecko.get('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h')
        const data = require('./mockCrypto.json')
        setCoin({ data, loading: false })
        navigateToDetail(data[0])
      } catch (error) {
        console.warn('====>', error.message)
        setCoin({ loading: false, error: true })
      }
    })()
  }, [])

  const navigateToDetail = crypto => navigation.navigate('detail', { crypto })

  const Gradient = () => (
    <Defs key={'gradient'}>
      <LinearGradient id={'gradient'} x1={'0'} y={'0%'} x2={'100%'} y2={'0%'}>
        <Stop offset={'0%'} stopColor={'#acffa5'} />
        <Stop offset={'100%'} stopColor={MAINCOLOR} />
      </LinearGradient>
    </Defs>
  )
  const renderItem = ({ item, index }) => {
    return (
      <ListItem onPress={navigateToDetail.bind(null, item)} avatar>
        <Left>
          <Thumbnail small source={{ uri: item.image }} />
        </Left>
        <Body>
          <Text style={styles.text}>{item.name} ({item.symbol.toUpperCase()})</Text>
          <Text style={{ color: item.price_change_percentage_24h > 0 ? '#59ebff' : '#fc1e51' }} note>{item.price_change_percentage_24h.toFixed(2)}%</Text>
          <Text style={{ color: 'white' }} note>Market Cap:{new BigNumber(item.market_cap).toFormat()}</Text>

          {/* <Text style={{ color: 'white' }} note>Volume: {item.total_volume}</Text>
        <Text style={{ color: 'white' }} note>Circulating Supply: {item.circulating_supply}</Text> */}

        </Body>
        <Right>
          <Text style={{ color: '#dfffd3' }}>$ {item.current_price}</Text>
          <LineChart
            style={{ height: 30, width: 100 }}
            data={item.sparkline_in_7d.price}
            contentInset={{ top: 10, bottom: 10 }}
            svg={{
              strokeWidth: 2,
              stroke: 'url(#gradient)'
            }}
          >
            <Grid />
            <Gradient />
          </LineChart>
        </Right>
      </ListItem>)
  }

  return (
    <Container>
      <Text style={styles.welcome}>MINHA CRYPTO</Text>
      {/* <Svg
        height='60'
        width='200'
      >
        <SVGText
          fill='#c6ffcd'
          stroke={MAINCOLOR}
          fontSize='25'
          // fontWeight='bold'
          x='100'
          y='20'
          textAnchor='middle'
          strokeWidth={1}
        >Minha Crypto</SVGText>
      </Svg> */}
      {/* <Svg
        style={{ position: 'absolute', bottom: 0 }}
        height='100%'
        width='100%'
      >
        <Defs>
          <LinearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'>
            <Stop offset='0%' stopColor='rgb(0,0,0)' stopOpacity='0' />
            <Stop offset='100%' stopColor='red' stopOpacity='1' />
          </LinearGradient>
        </Defs>
        <Rect x='0' y='0' width='100%' height='100%' fill='url(#grad)' />
      </Svg> */}
      <FlatList
        keyExtractor={item => item.id}
        data={coinData.data}
        renderItem={renderItem}
      />
    </Container>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505'
  },
  text: {
    color: MAINCOLOR
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: MAINCOLOR
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})
