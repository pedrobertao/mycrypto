import PushNotification from 'react-native-push-notification'
import BackgroundTimer from 'react-native-background-timer';

import coinGecko from '../../services/coingecko'

const JOB_STATE ={
  WAITING: 0,
  RUNNING: 1,
  STOPPED: 2,
}

class NotificationServices {
  _coins = {};
  _trackCoinsJob = null;
  _currentJobState = 0;

  constructor () {
    this._init()
  }

  _init = () => {
    if(this._currentJobState === JOB_STATE.WAITING){
      this._trackCoins()
    }
  }

  _trackCoins = () => {
    BackgroundTimer.stopBackgroundTimer()
    BackgroundTimer.runBackgroundTimer(async () => { 
        const data = await coinGecko.getCoins()
        console.log('Service running !', data)
        for(let coin of data ) {
          if(this._coins[coin.id]){
            console.log('Processing coin',coin.current_price, this._coins)
            this._processCoinPrice(coin)
          }
        }
    },5000)
  }

  _processCoinPrice = coin => {
    const { high, low } = this._coins[coin.id]
    let messageNotification = null
    if(Number(coin.current_price) < low) {
      this._coins[coin.id].low = 0
      this.pushNotification(`${coin.symbol.toUpperCase()} ficou abaixo de ${low} e está valendo ${coin.current_price}`)
    }
    if(Number(coin.current_price) > high) { 
      this._coins[coin.id].high = Number.MAX_SAFE_INTEGER
      this.pushNotification(`${coin.symbol.toUpperCase()} ficou acima de ${high} e está valendo ${coin.current_price}`)
    }

    if(messageNotification) this.pushNotification(messageNotification)
    
  }

  pushNotification = message => {
    PushNotification.localNotification({
      bigText: 'Hello from MinhaCrypto androiders', // (optional) default: "message" prop
      subText: 'This is the subtext for minhacrypto', // (optional) default: none
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: 'MinhaCryptoNotifications', // (optional) add tag to message
      title: 'MinhaCrypto', // (optional)
      message // (required)
    })
  }

  isFollowing = (id) => {
    return !!this._coins[id]
  }
  follow = ({id, high = Number.MAX_SAFE_INTEGER, low = 0 }) => {
    this._coins[id] = { high, low }
  }

  close = () => {
    BackgroundTimer.stopBackgroundTimer()
  }
}

export default new NotificationServices()
