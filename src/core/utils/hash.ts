import { createHash } from 'crypto'

interface ToString {
  toString(): string
}
export const hash = (dataList: Array<ToString>): number => {
  const hash = createHash('md5')
  for (const data of dataList) {
    hash.update(data.toString())
  }
  return parseInt('0x' + hash.digest('hex'), 16)
}
