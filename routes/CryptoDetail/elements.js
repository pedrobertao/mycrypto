import React, { useState, useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { AreaChart } from 'react-native-svg-charts'
import LinearGradient from 'react-native-linear-gradient'
import { Path, Defs, LinearGradient as LinearGradientSvg, Stop } from 'react-native-svg'
import BigNumber from 'bignumber.js'
import Icon from 'react-native-vector-icons/Feather'

import { View, Text, systemColors } from '../../components/elements'
import { SetButton, FollowInput, FollowButton } from './styled'

const Line = ({ line }) => (
  <Path
    key={'line'}
    d={line}
    stroke={systemColors.secondary}
    fill={'none'}
  />
)
const Gradient = ({ index }) => (
  <Defs key={index}>
    <LinearGradientSvg id={'gradient'} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
      <Stop offset='0%' stopColor={systemColors.secondary} stopOpacity={0.2} />
      <Stop offset='20%' stopColor={systemColors.secondary} stopOpacity={0} />
    </LinearGradientSvg>
  </Defs>
)
export const Chart = ({ data }) => (
  <AreaChart
    style={{ height: 200 }}
    data={data}
    xAccessor={({ index }) => index}
    yAccessor={({ item }) => item[1]}
    contentInset={{ top: 30, bottom: 30 }}
    svg={{ fill: 'url(#gradient)' }}
  >
    <Line />
    <Gradient />
  </AreaChart>
)

export const FollowGradient = () => (
  <LinearGradient
    colors={systemColors.cardGradient}
    start={{ x: 0.3, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{ borderRadius: 4, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
  />
)

export const GraphOption = ({ selected, children }) => (
  <View width='100%' padding={5}>
    <Text transform='uppercase' color={selected ? systemColors.blue : 'rgba(255,255,255,0.2)'}>
    1 {children}
    </Text>
  </View>
)

export const GraphLoading = ({ loading }) => (
  loading && (
    <ActivityIndicator
      style={{ transform: [{ translateY: 40 }] }}
      color={systemColors.secondary}
    />
  ))

export const FollowValue = ({ type, initialValue = '0', onSet, currentPrice }) => {
  const [value, setValue] = useState(initialValue)
  const [current, setCurrent] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
    setCurrent(initialValue)
  }, [currentPrice])

  return (
    <View align='center' justify='space-around' row>
      <Text transform='capitalize' size={14} font='regular' secondary>{type}</Text>
      <View align='center'>
        <FollowInput
          value={value}
          onChangeText={newValue => setValue(newValue)}
        />
        <Text size={9} secondary>Current: {current}</Text>
      </View>
      <SetButton
        onPress={() => {
          setCurrent(value)
          onSet(type, value)
        }}>
        <Text size={12}>SET</Text>
      </SetButton>
    </View>
  )
}

export const MarketStats = ({ label, value }) => (
  <View row justify='space-between' align='center'>
    <Text size={12}>{label}</Text>
    <Text secondary>{new BigNumber(value).toFormat()}</Text>
  </View>
)

export const FollowIcon = ({ onPress, disabled }) => (
  <FollowButton
    onPress={onPress}>
    <Icon
      name={disabled ? 'eye-off' : 'eye'}
      color={systemColors.secondary}
      size={32 * 0.8}
    />
    <Text size={10}>{disabled ? 'Unfollow' : 'Follow'}</Text>
  </FollowButton>
)
