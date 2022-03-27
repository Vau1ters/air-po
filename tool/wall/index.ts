import { Random } from './random'
import * as fs from 'fs'
import { TileLayer } from '@game/stage/tileLayerLoader'
import { StageSetting } from '@game/stage/stageLoader'
import { TileSet } from '@game/stage/tileSet'
import wallType from '../../res/misc/wall.json'

type WallType = keyof typeof wallType.typeMap

export class WallLoader {
  private rand: Random = new Random()

  constructor(private layer: TileLayer, private gidBegin: number, private gidEnd: number) {}

  public getTileId(x: number, y: number): number {
    const type = this.getType(x, y)
    const candidates = wallType.typeMap[type]
    const tileId = this.randomChoice(candidates)
    return tileId
  }

  private getType(x: number, y: number): WallType {
    const leftUp = this.hasTile(x - 1, y - 1)
    const up = this.hasTile(x + 0, y - 1)
    const rightUp = this.hasTile(x + 1, y - 1)
    const right = this.hasTile(x + 1, y + 0)
    const rightDown = this.hasTile(x + 1, y + 1)
    const down = this.hasTile(x + 0, y + 1)
    const leftDown = this.hasTile(x - 1, y + 1)
    const left = this.hasTile(x - 1, y + 0)

    if (leftUp && up && rightUp && right && rightDown && down && leftDown && left)
      return 'CompletelyFilled'
    if (!leftUp && up && rightUp && right && rightDown && down && leftDown && left)
      return 'LackCornerLeftUp'
    if (leftUp && up && !rightUp && right && rightDown && down && leftDown && left)
      return 'LackCornerRightUp'
    if (leftUp && up && rightUp && right && !rightDown && down && leftDown && left)
      return 'LackCornerRightDown'
    if (leftUp && up && rightUp && right && rightDown && down && !leftDown && left)
      return 'LackCornerLeftDown'
    if (!up && right && down && left) return 'LackUp'
    if (!right && down && left && up) return 'LackRight'
    if (!down && left && up && right) return 'LackDown'
    if (!left && up && right && down) return 'LackLeft'
    if (up && down && !right && !left) return 'LackLeftRight'
    if (!up && !down && right && left) return 'LackUpDown'
    if (!leftUp && !up && !left && rightDown && down && right) return 'CornerLeftUp'
    if (!rightUp && !up && !right && leftDown && down && left) return 'CornerRightUp'
    if (!rightDown && !down && !right && leftUp && up && left) return 'CornerRightDown'
    if (!leftDown && !down && !left && rightUp && up && right) return 'CornerLeftDown'
    if (up && !right && !rightDown && !down && !leftDown && !left) return 'ProtrudeUp'
    if (right && !down && !leftDown && !left && !leftUp && !up) return 'ProtrudeRight'
    if (down && !left && !leftUp && !up && !rightUp && !right) return 'ProtrudeDown'
    if (left && !up && !rightUp && !right && !rightDown && !down) return 'ProtrudeLeft'
    return 'Invalid'
  }

  private hasTile(x: number, y: number): boolean {
    if (x < 0) return false
    if (y < 0) return false
    if (x >= this.layer.width) return false
    if (y >= this.layer.height) return false
    const gid = this.layer.data[x + y * this.layer.width]
    return gid > 0
  }

  private randomChoice(candidates: number[]): number {
    return candidates[Math.abs(this.rand.next()) % candidates.length]
  }
}

const updateLayer = (layer: TileLayer, gidBegin: number, gidEnd: number): void => {
  const loader = new WallLoader(layer, gidBegin, gidEnd)
  for (let y = 0; y < layer.height; y++) {
    for (let x = 0; x < layer.width; x++) {
      const index = x + y * layer.width
      if (gidBegin <= layer.data[index] && layer.data[index] < gidBegin + 40) {
        const tileId = loader.getTileId(x, y)
        layer.data[index] = gidBegin + tileId
      }
    }
  }
}

const updateStage = (stage: StageSetting): StageSetting => {
  const wallTileSetIndex = stage.tilesets.findIndex((tileSet: TileSet): boolean =>
    tileSet.source.includes('wall')
  )
  const gidBegin = stage.tilesets[wallTileSetIndex].firstgid
  const gidEnd = stage.tilesets[wallTileSetIndex + 1].firstgid ?? Infinity
  const mapLayer = stage.layers.find(layer => layer.name === 'map')
  if (mapLayer !== undefined) {
    updateLayer(mapLayer as TileLayer, gidBegin, gidEnd)
  }
  return stage
}

export const updateStages = (): void => {
  for (const e of fs.readdirSync('res/stage', { withFileTypes: true })) {
    if (e.isFile()) {
      const match = /^(.*)\.json$/.exec(e.name)
      if (match == null) continue
      const name = match[1]
      if (name.includes('autogen')) continue
      const content = fs.readFileSync(`res/stage/${e.name}`, 'ascii')
      const result = JSON.stringify(updateStage(JSON.parse(content)), null, '  ')
      fs.writeFileSync(`res/stage/autogen/${name}.autogen.json`, result)
    }
  }
}
