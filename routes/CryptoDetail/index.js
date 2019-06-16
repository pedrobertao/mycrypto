import React, { useState, useEffect } from 'react'
import { Text } from 'react-native'
import { Container, systemColors } from '../../components/elements'
import MyCrypto from '../../services/coins'

const CryptoDetail = props => {
  const crypto = props.navigation.getParam('crypto', {})

  const [coin, setCoin] = useState({ address: '', loading: true })

  useEffect(async () => {
    const address = await MyCrypto.getAddress(crypto.symbol)
    setCoin({ loading: false, address })
  }, [])

  return (
    <Container>
      <Text style={{ fontSize: 20, color: systemColors.green }}>{crypto.name}</Text>
      <Text style={{ fontSize: 18, color: systemColors.green }}>Address: {coin.address}</Text>
    </Container>
  )
}

export default CryptoDetail
