import React from 'react'
import styled from 'styled-components'
import LinearGradient from 'react-native-linear-gradient'

export const systemColors = {
  background: '#050505',
  green: '#4cff9c',
  blue: '#6AC8C9',
  red: '#fc1e51',
  white: '#e8e8e8',
  lightRed: '#cc6a6a',
  secondary: '#8f9fc4'
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
  color: ${({ color, secondary }) => secondary ? systemColors.secondary : color};
  font-family: AvenirNext-${({ font }) => font};
`

Text.defaultProps = {
  color: systemColors.white,
  size: 18,
  font: 'Medium'
}

export const View = styled.View`
  ${({ align }) => align && `align-items:${align}`}
  ${({ justify }) => justify && `justify-content:${justify}`}
  ${({ flex }) => flex && `flex:${flex}`}
  ${({ row }) => row && `flex-direction:row`}
  ${({ width }) => width && `width: ${width}px`}
  ${({ height }) => height && `height: ${height}px`}
  ${({ background }) => background && `background-color: ${background}`};
`

export const GradientContainer = ({ children }) => (
  <LinearGradient
    colors={['#25304C', '#121722']}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={{ height: '100%',
      width: '100%',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0 }}>
    <Container background='transparent'>
      {children}
    </Container>
  </LinearGradient>
)
