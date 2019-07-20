import PushNotification from 'react-native-push-notification'
import BackgroundTimer from 'react-native-background-timer'
import coinGecko from '../../services/coingecko'

import UserCoins from './coinsRealm'

const JOB_STATE ={
  WAITING: 0,
  RUNNING: 1,
  STOPPED: 2
}

class NotificationServices {
  _coins = {};
  _trackCoinsJob = null;
  _currentJobState = 0;
  _listeners = []
  constructor () {
    this._init()
    this._coins = UserCoins.getCoins()
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
        console.log('=====Service running on Background!', data)
        this._listeners.forEach(l=>{l(data)})
        for(let coin of data ) {
          if(this._coins[coin.id]){
            console.log('Processing coin',coin.current_price, this._coins)
            this._processCoinPrice(coin)
          }
        }
    },5000)
  }

  addListener = cb => {
    this._listeners.push(cb)
  }

  removeListener = cb => {
    this._listeners = this._listeners.filter(l => l !== cb)
  }
  
  _processCoinPrice = coin => {
    const { high, low } = this._coins[coin.id]
    let messageNotification = null

    const pushNotification = message => {
      UserCoins.setCoin({ id: coin.id, ...this._coins[coin.id]})
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
    if(Number(coin.current_price) < low) {
      this._coins[coin.id].low = 0
      pushNotification(`${coin.symbol.toUpperCase()} ficou abaixo de ${low} e está valendo ${coin.current_price}`)
    }
    if(Number(coin.current_price) > high) { 
      this._coins[coin.id].high = Number.MAX_SAFE_INTEGER
      pushNotification(`${coin.symbol.toUpperCase()} ficou acima de ${high} e está valendo ${coin.current_price}`)
    }

    if(messageNotification) this.pushNotification(messageNotification)
  
  }

  isFollowing = id => {
    console.log('=====IsFollowing ? ', this._coins[id])
    return !!this._coins[id]
  }

  follow = ({id, high = Number.MAX_SAFE_INTEGER, low = 0 }) => {
    console.log('======>Followin', id, high, low)
    this._coins[id] = { high: Number(high), low: Number(low) }
    UserCoins.setCoin({ id })
  }

  unfollow = (id) => {
    this._coins[id] = null
    console.log('=====Unfollowing', id)
    UserCoins.removeCoin(id)
  }

  close = () => {
    BackgroundTimer.stopBackgroundTimer()
  }
}

export default new NotificationServices()
