import React from 'react'

import { AreaChart } from 'react-native-svg-charts'
import { Path, Defs, LinearGradient as LinearGradientSvg, Stop } from 'react-native-svg'
import { systemColors } from '../../components/elements'

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
