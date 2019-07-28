import React from 'react'
import { ActivityIndicator } from 'react-native'
import { AreaChart } from 'react-native-svg-charts'
import LinearGradient from 'react-native-linear-gradient'
import { Path, Defs, LinearGradient as LinearGradientSvg, Stop } from 'react-native-svg'

import { View, Text, systemColors } from '../../components/elements'

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
