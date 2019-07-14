/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import BigNumber from 'bignumber.js'
import LinearGradient from 'react-native-linear-gradient'

import { Text, View } from '../../components/elements'

const Item = ({ item, index, onPress }) => (
  <TouchableOpacity>
    <LinearGradient
      colors={['#28324A', '#3e4d73']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 4,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <Image source={{ uri: item.image }}
        style={{ width: 35, height: 35, marginRight: 10 }} />
      <View flex={1}>
        <View justify='space-between' row>
          <Text font='bold' size={16}>{item.name}({item.symbol.toUpperCase()})</Text>
          <Text font='bold' size={16}>{new BigNumber(item.current_price).precision(4).toFormat()} $</Text>
        </View>
        <View align='center' justify='space-between' row>
          <Text color='#8f9fc4' font='regular' size={12}>Rank {item.market_cap_rank}</Text>
          <Text color={item.price_change_percentage_24h > 0 ? '#6AC8C9' : '#cc6a6a'}
            size={14}>{new BigNumber(item.price_change_percentage_24h).toFixed(2)}</Text>
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
)

export default Item
