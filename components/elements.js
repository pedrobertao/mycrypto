import styled from 'styled-components'
export const systemColors = {
  background: '#050505',
  green: '#4cff9c',
  blue: '#59ebff',
  red: '#fc1e51'
}

export const Container = styled.SafeAreaView`
  flex:1;
  background-color: ${systemColors.background};
`

export const Text = styled.Text`
  font-size: ${({ size }) => size}px;
  color: ${systemColors.green};
`

Text.defaultProps = {
  size: 20
}

export const View = styled.View`
  ${({ align }) => align && `align-items:${align}`}
  ${({ justify }) => justify && `justify-content:${justify}`}
  ${({ flex }) => flex && `flex:${flex}`}
  ${({ row }) => row && `flex-direction:row`}
`
