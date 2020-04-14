import { World } from '../core/ecs/world'
import { WallFactory } from '../core/entities/wallFactory'
import { PositionComponent } from '../core/components/positionComponent'

class Random {
  private x: number
  private y: number
  private z: number
  private w: number

  constructor(seed = 88675123) {
    this.x = 123456789
    this.y = 362436069
    this.z = 521288629
    this.w = seed
  }
  // XorShift
  next(): number {
    const t = this.x ^ (this.x << 11)
    this.x = this.y
    this.y = this.z
    this.z = this.w
    return (this.w = this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8)))
  }
}

export class MapBuilder {
  private world: World
  private rand: Random

  public constructor(world: World) {
    this.world = world
    this.rand = new Random()
  }

  public build(map: any): void {
    const factory = new WallFactory()
    const wallTileSet = map.tilesets[0]

    for (let x = 0; x < map.width; x++) {
      for (let y = 0; y < map.height; y++) {
        const tileId = map.layers[0].data[x + y * map.width]
        if (tileId === 0) continue

        const cells = []
        for (let j = 0; j < 3; j++) {
          for (let i = 0; i < 3; i++) {
            const xi = x + i - 1
            const yj = y + j - 1
            if (0 <= xi && xi < map.width && 0 <= yj && yj < map.height) {
              cells.push(map.layers[0].data[xi + yj * map.width])
            } else {
              cells.push(0)
            }
          }
        }
        factory.id = this.calcId(cells) - wallTileSet.firstgid
        const wall = factory.create()
        const p = wall.getComponent('Position') as PositionComponent
        p.x = 8 * x
        p.y = 8 * y
        this.world.addEntity(wall)
      }
    }
  }

  private calcId(cell: number[]): number {
    if (
      cell[0] != 0 &&
      cell[1] != 0 &&
      cell[2] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[6] != 0 &&
      cell[7] != 0 &&
      cell[8] != 0
    ) {
      // completely filled
      return this.randomChoice([10, 11, 14, 15, 18, 19, 22, 23])
    }
    if (
      cell[1] != 0 &&
      cell[2] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[6] != 0 &&
      cell[7] != 0 &&
      cell[8] != 0
    ) {
      // lack left up
      return 32
    }
    if (
      cell[0] != 0 &&
      cell[1] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[6] != 0 &&
      cell[7] != 0 &&
      cell[8] != 0
    ) {
      // lack right up
      return 29
    }
    if (
      cell[0] != 0 &&
      cell[1] != 0 &&
      cell[2] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[7] != 0 &&
      cell[8] != 0
    ) {
      // lack left down
      return 8
    }
    if (
      cell[0] != 0 &&
      cell[1] != 0 &&
      cell[2] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[6] != 0 &&
      cell[7] != 0
    ) {
      // lack right down
      return 5
    }
    if (cell[1] == 0 && cell[3] == 0 && cell[5] != 0 && cell[7] != 0) {
      // left up corner
      return 1
    }
    if (cell[1] == 0 && cell[3] != 0 && cell[5] == 0 && cell[7] != 0) {
      // right up corner
      return 4
    }
    if (cell[1] != 0 && cell[3] == 0 && cell[5] != 0 && cell[7] == 0) {
      // left down corner
      return 25
    }
    if (cell[1] != 0 && cell[3] != 0 && cell[5] == 0 && cell[7] == 0) {
      // right down corner
      return 28
    }
    if (cell[1] == 0) {
      // up
      return this.randomChoice([2, 3, 30, 31])
    }
    if (cell[3] == 0) {
      // left
      return this.randomChoice([9, 17, 16, 24])
    }
    if (cell[5] == 0) {
      // right
      return this.randomChoice([12, 20, 13, 21])
    }
    if (cell[7] == 0) {
      // down
      return this.randomChoice([26, 27, 6, 7])
    }
    return 1
  }

  private randomChoice(candidates: number[]): number {
    return candidates[Math.abs(this.rand.next()) % candidates.length]
  }
}
