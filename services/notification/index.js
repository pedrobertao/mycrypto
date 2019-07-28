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

  get coins () {
    return this._coins
  }

  _init = () => {
    if(this._currentJobState === JOB_STATE.WAITING){
      this._currentJobState = JOB_STATE.RUNNING
      this._trackCoins()
    }
  }

  _trackCoins = () => {
    const getCoins = async () => {
      try {
        const data = await coinGecko.getCoins()
        console.log('=====Service running on Background!', data)
        this._listeners.forEach(cb=> { cb('fetch',data) })
        for(const coin of data ) {
          if(this._coins[coin.id]){
            // console.log('Processing coin',coin.current_price, this._coins)
            this._processCoinPrice(coin)
          }
        }
      } catch (error) {
        console.log('====>Error on background Service', error)
      }
    }
    getCoins()
    BackgroundTimer.stopBackgroundTimer()
    BackgroundTimer.runBackgroundTimer(getCoins,10000)
  }

  _processCoinPrice = coin => {
    const { high, low } = this._coins[coin.id]
    let messageNotification = null

    const pushNotification = message => {
      UserCoins.setCoin({ id: coin.id, ...this._coins[coin.id]})
      PushNotification.localNotification({
        // bigText: 'Hello from MinhaCrypto androiders', // (optional) default: "message" prop
        // subText: 'This is the subtext for minhacrypto', // (optional) default: none
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        tag: 'MyCryptoNotifications', // (optional) add tag to message
        title: 'MyCrypto', // (optional)
        message // (required)
      })
    }
    if(Number(coin.current_price) < low) {
      this._coins[coin.id].low = 0
      pushNotification(`${coin.symbol.toUpperCase()} is bellow ${low} with ${coin.current_price} price`)
    }
    if(Number(coin.current_price) > high) { 
      this._coins[coin.id].high = Number.MAX_SAFE_INTEGER
      pushNotification(`${coin.symbol.toUpperCase()} is above ${high} with ${coin.current_price} price`)
    }

    if(messageNotification) this.pushNotification(messageNotification)
  
  }


  addListener = cb => {
    this._listeners.push(cb)
  }

  removeListener = cb => {
    this._listeners = this._listeners.filter(l => l !== cb)
  }

  isFollowing = id => {
    return !!this._coins[id]
  }

  getCoin = id => {
    let high = 0;
    let low = 0;
    if(this._coins[id]){
      high = this._coins[id].high
      low = this._coins[id].low
    }
    console.log('=====>Inner get Coins',this._coins[id])

    return {
      id,
      high: high === Number.MAX_SAFE_INTEGER ? 0 : high,
      low: low === 0 ? 0 : low
    }
  }

  setFollowValues = ({id, high, low}) => {
    let prevHigh = 0;
    let prevLow = 0;
    
    let updatedHigh;
    let updatedLow;

    if(this._coins[id]){
      prevHigh = this._coins[id].high
      prevLow = this._coins[id].low
    }
    updatedHigh = Number(high || prevHigh)
    updatedLow = Number(low || prevLow)
      
    this._coins[id] = { high: updatedHigh, low: updatedLow }
    UserCoins.setCoin({ id, ...this._coins[id] })
  }
  
  follow = id => {
    if(!this._coins[id]){
      this._coins[id] = { high: Number.MAX_SAFE_INTEGER, low: 0}
    }
    UserCoins.setCoin({ id, ...this._coins[id] })
    this._listeners.map(cb => cb('follow', id))
  }

  unfollow = (id) => {
    UserCoins.removeCoin(id)
    this._coins[id] = null
    this._listeners.map(cb => cb('unfollow', id))
  }

  close = () => {
    BackgroundTimer.stopBackgroundTimer()
  }
}

export default new NotificationServices()
