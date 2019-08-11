import BigNumber from 'bignumber.js'

export const formatNumber = (num, precision = 6) => (
  new BigNumber(num).precision(precision).toFormat()
)
