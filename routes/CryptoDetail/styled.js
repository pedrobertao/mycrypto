import styled from 'styled-components'
import { systemColors } from '../../components/elements'

export const FollowInput = styled.TextInput.attrs({
  keyboardType: 'numeric',
  returnKeyType: 'done',
  underlineColorAndroid: 'transparent'
})`
    height: 30;
    color: ${systemColors.white};
    border-bottom-width: 1;
    border-bottom-color: ${systemColors.blue};
    width: 85px;
    margin-horizontal: 15px;
    font-size: 16px;
    padding: 0;
    text-align: center;
`

export const CardWrapper = styled.View`
    height: 110px;
    padding: 20px;
    border-radius: 4;
    border-width: 1px;
    border-color: ${systemColors.secondary};
    margin-vertical: 5px;
    justify-content: center;
`

export const SetButton = styled.TouchableOpacity`
    background-color: ${systemColors.secondary};
    padding: 5px;
    color: ${systemColors.secondary};
    border-radius: 6px;
    align-items: center;
    width: 35px;
`

export const FollowButton = styled.TouchableOpacity`
    width: 40%;
    align-items: center;
    margin-bottom: 5px;
`
