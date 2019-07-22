import Realm from 'realm'

// Realm.deleteFile({ path: 'coins.realm' })
export const realmToPlainObject = realmObject => {
  let plainObject = {}

  if (!realmObject) return null

  if (realmObject.isEmpty && typeof realmObject.isEmpty === 'function') {
    plainObject = Array.from(realmObject).map(objFromArray =>
      realmToPlainObject(objFromArray)
    )
  } else {
    Object.keys(realmObject).forEach(key => {
      plainObject[key] =
        realmObject[key] && typeof realmObject[key] === 'object'
          ? realmToPlainObject(realmObject[key])
          : realmObject[key]
    })
  }
  return plainObject
}

const Coin = {
  name: 'Coin',
  primaryKey: 'id',
  properties: {
    id: 'string',
    high: 'double',
    low: 'double',
    follow: 'bool'
  }
}

const UserCoins = new Realm({
  path: 'coins.realm',
  schema: [Coin],
  schemaVersion: 1
})

UserCoins.addCoin = id => {
  if (!UserCoins.objectForPrimaryKey(Coin.name, id)) {
    UserCoins.write(() => {
      UserCoins.create(Coin.name, {
        id,
        high: Number.MAX_SAFE_INTEGER,
        low: 0,
        follow: true
      }, true)
    })
    console.log('====>AddCoin', UserCoins.objectForPrimaryKey(Coin.name, id))
  }
  return UserCoins.objectForPrimaryKey(Coin.name, id)
}

UserCoins.setCoin = ({ id, high = Number.MAX_SAFE_INTEGER, low = 0 }) => {
  const coinToSet = UserCoins.addCoin(id)
  UserCoins.write(() => {
    coinToSet.high = high
    coinToSet.low = low
    coinToSet.follow = true
  })
  console.log('====>SetCoin', coinToSet)

  return coinToSet
}

UserCoins.removeCoin = id => {
  UserCoins.write(() => {
    const coinToRemove = UserCoins.objectForPrimaryKey(Coin.name, id)
    coinToRemove.follow = false
  })
  return UserCoins.getCoins()
}

UserCoins.getCoins = () => {
  const userCoins = {}
  if (!UserCoins.objects(Coin.name).length) {
    UserCoins.init()
  }
  UserCoins.objects(Coin.name).filter(c => c.follow === true).forEach(c => {
    userCoins[c.id] = {
      high: c.high,
      low: c.low,
      follow: true
    }
  })
  return userCoins
}

UserCoins.init = () => {
  if (!(UserCoins.objects(Coin.name).length)) {
    UserCoins.setCoin({ id: 'bitcoin' })
    UserCoins.setCoin({ id: 'ethereum' })
    UserCoins.setCoin({ id: 'tron' })
    console.log('INITED !')
  }
}
export default UserCoins
