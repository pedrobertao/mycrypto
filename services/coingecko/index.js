import axios from 'axios'

const coinGecko = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3'
})

/**
 * @returns {Array}
 */
coinGecko.getCoins = async () => {
  const { data } = await coinGecko.get('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h')
  return data
}

/**
 * @returns {Object}
 */
coinGecko.getCoinStats = async (id, from, to) => {
  const { data } = await coinGecko.get(`/coins/${id}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`)
  return data
}

coinGecko.STATS_OPTIONS = ['hour', 'day', 'week']

export default coinGecko
