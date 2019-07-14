import styled from 'styled-components'
export const systemColors = {
  background: '#050505',
  green: '#4cff9c',
  blue: '#59ebff',
  red: '#fc1e51',
  white: '#e8e8e8'
}

export const Container = styled.SafeAreaView`
  flex:1;
  background-color: ${({ background }) => background};
`

Container.defaultProps = {
  background: systemColors.background
}

export const Text = styled.Text`
  font-size: ${({ size }) => size}px;
  color: ${({ color }) => color};
  font-family: AvenirNext-${({ font }) => font};
`

Text.defaultProps = {
  color: systemColors.white,
  size: 20,
  font: 'Medium'
}

export const View = styled.View`
  ${({ align }) => align && `align-items:${align}`}
  ${({ justify }) => justify && `justify-content:${justify}`}
  ${({ flex }) => flex && `flex:${flex}`}
  ${({ row }) => row && `flex-direction:row`}
  ${({ width }) => width && `width: ${width}px`}
   ${({ background }) => background && `background-color: ${background}`};
`
