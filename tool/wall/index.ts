import { Random } from './random'
import * as fs from 'fs'

const rand = new Random()

type Stage = {
  layers: TileLayer[]
  tilesets: TileSet[]
}

type TileSet = {
  firstgid: number
  source: string
}

type TileLayer = {
  data: number[]
  height: number
  id: number
  name: string
  opacity: number
  type: 'tilelayer'
  visible: boolean
  width: number
  x: number
  y: number
}

// Clockwise
type WallType =
  | 'CompletelyFilled'
  | 'LackCornerLeftUp'
  | 'LackCornerRightUp'
  | 'LackCornerRightDown'
  | 'LackCornerLeftDown'
  | 'LackUp'
  | 'LackRight'
  | 'LackDown'
  | 'LackLeft'
  | 'LackLeftRight'
  | 'LackUpDown'
  | 'CornerLeftUp'
  | 'CornerRightUp'
  | 'CornerRightDown'
  | 'CornerLeftDown'
  | 'ProtrudeUp'
  | 'ProtrudeRight'
  | 'ProtrudeDown'
  | 'ProtrudeLeft'
  | 'Invalid'

export class WallLoader {
  constructor(private layer: TileLayer, private gidBegin: number, private gidEnd: number) {}

  public getTileId(x: number, y: number): number {
    const type = this.getType(x, y)
    const candidates = this.getIndex(type)
    const tileId = this.randomChoice(candidates)
    return tileId
  }

  private getIndex(type: WallType): number[] {
    switch (type) {
      case 'CompletelyFilled':
        return [9, 10, 13, 14, 17, 18, 21, 22]
      case 'LackCornerLeftUp':
        return [31]
      case 'LackCornerRightUp':
        return [28]
      case 'LackCornerRightDown':
        return [4]
      case 'LackCornerLeftDown':
        return [7]
      case 'LackUp':
        return [1, 2, 29, 30]
      case 'LackRight':
        return [11, 12, 19, 20]
      case 'LackDown':
        return [5, 6, 25, 26]
      case 'LackLeft':
        return [8, 15, 16, 23]
      case 'LackLeftRight':
        return [37]
      case 'LackUpDown':
        return [36]
      case 'CornerLeftUp':
        return [0]
      case 'CornerRightUp':
        return [3]
      case 'CornerRightDown':
        return [27]
      case 'CornerLeftDown':
        return [24]
      case 'ProtrudeUp':
        return [33]
      case 'ProtrudeRight':
        return [32]
      case 'ProtrudeDown':
        return [34]
      case 'ProtrudeLeft':
        return [34]
      case 'Invalid':
        return [38]
    }
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
    return this.gidBegin <= gid && gid < this.gidEnd
  }

  private randomChoice(candidates: number[]): number {
    return candidates[Math.abs(rand.next()) % candidates.length]
  }
}

const updateLayer = (layer: TileLayer, gidBegin: number, gidEnd: number): void => {
  const loader = new WallLoader(layer, gidBegin, gidEnd)
  for (let y = 0; y < layer.height; y++) {
    for (let x = 0; x < layer.width; x++) {
      const index = x + y * layer.width
      if (gidBegin <= layer.data[index] && layer.data[index] < gidEnd) {
        const tileId = loader.getTileId(x, y)
        layer.data[index] = gidBegin + tileId
      }
    }
  }
}

const updateStage = (stage: Stage): Stage => {
  const wallTileSetIndex = stage.tilesets.findIndex((tileSet: TileSet): boolean =>
    tileSet.source.includes('wall')
  )
  const gidBegin = stage.tilesets[wallTileSetIndex].firstgid
  const gidEnd = stage.tilesets[wallTileSetIndex + 1].firstgid ?? Infinity
  const mapLayer = stage.layers.find(layer => layer.name === 'map')
  if (mapLayer !== undefined) {
    updateLayer(mapLayer, gidBegin, gidEnd)
  }
  return stage
}

export const updateStages = (): void => {
  for (const e of fs.readdirSync('res/stage', { withFileTypes: true })) {
    if (e.isFile()) {
      const path = `res/stage/${e.name}`
      const content = fs.readFileSync(path, 'ascii')
      const result = JSON.stringify(updateStage(JSON.parse(content)), null, '  ')
      fs.writeFileSync(path, result)
    }
  }
}
