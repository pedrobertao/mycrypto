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
    width: 70px;
    margin-horizontal: 15px;
    font-size: 16px;
    padding: 0;
    text-align: center;
`

export const CardWrapper = styled.View`
    height: 110px;
    padding: 15px;
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
    position: absolute;
    border-radius: 6px;
    align-items: center;
    z-index: 999;
    elevation: 10;
    margin-left: 10;
    width: 45px;
    right: 90;
    top: 40
`
