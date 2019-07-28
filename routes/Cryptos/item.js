import React, { memo } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import BigNumber from 'bignumber.js'
import LinearGradient from 'react-native-linear-gradient'

import { Text, View, systemColors } from '../../components/elements'

const Item = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={systemColors.cardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 4,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 10
      }}
    >
      <Image source={{ uri: item.image }}
        style={{ width: 35, height: 35, marginRight: 10 }} />
      <View flex={1}>
        <View justify='space-between' row>
          <Text font='bold' size={16}>
            {item.name}({item.symbol.toUpperCase()})
          </Text>
          <Text font='bold' size={16}>
            {item.current_price.toPrecision(4)} $
          </Text>
        </View>
        <View align='center' justify='space-between' row>
          <Text secondary font='regular' size={12}>Rank {item.market_cap_rank}</Text>
          <Text color={item.price_change_percentage_24h > 0 ? systemColors.blue : systemColors.lightRed}
            size={14}>{new BigNumber(item.price_change_percentage_24h).toFixed(2)}</Text>
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
)

export default memo(Item)
