import * as t from 'io-ts'

export const TileSetType = t.type({
  firstgid: t.number,
  source: t.string,
})
export type TileSet = t.TypeOf<typeof TileSetType>

export type TileSetData = {
  columns: number
  image: string
  imageheight: number
  imagewidth: number
  margin: number
  name: string
  spacing: number
  tilecount: number
  tiledversion: string
  tileheight: number
  tilewidth: number
  type: string
  version: number
}

export const getTileSetDataFromGid = (gid: number, tileSets: Array<TileSet>): TileSetData => {
  const { source } = tileSets.find(tileSet => tileSet.firstgid === gid) as TileSet
  return require(`/res/stage/${source}`) // eslint-disable-line  @typescript-eslint/no-var-requires
}
