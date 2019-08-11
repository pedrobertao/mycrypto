import React, { memo } from 'react'
import { Image, TouchableOpacity, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { Text, View, systemColors } from '../../components/elements'
import { formatNumber } from '../../utils/format'

const Item = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={systemColors.cardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.graph}
    >
      <Image source={{ uri: item.image }}
        style={styles.icon} />
      <View flex={1}>
        <View justify='space-between' row>
          <Text font='bold' size={16}>
            {item.name}({item.symbol.toUpperCase()})
          </Text>
          <Text font='bold' size={16}>
            {formatNumber(item.current_price)} $
          </Text>
        </View>
        <View align='center' justify='space-between' row>
          <Text secondary font='regular' size={12}>Rank {item.market_cap_rank}</Text>
          <Text color={item.price_change_percentage_24h > 0 ? systemColors.blue : systemColors.lightRed}
            size={14}>{item.price_change_percentage_24h.toFixed(2)}</Text>
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  graph: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 10
  }
})

export default memo(Item)
