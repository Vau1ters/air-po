import { World } from '@core/ecs/world'
import { Vec2 } from '@core/math/vec2'
import { BalloonVineFactory } from '@game/entities/tile/balloonVineFactory'
import { DandelionFactory } from '@game/entities/tile/dandelionFactory'
import { Enemy1Factory } from '@game/entities/tile/enemy1Factory'
import { MossFactory } from '@game/entities/tile/mossFactory'
import { Slime1Factory } from '@game/entities/tile/slime1Factory'
import { SnibeeFactory } from '@game/entities/tile/snibeeFactory'
import { ThroughFloorFactory } from '@game/entities/tile/throughFloorFactory'
import { TileEntityFactory } from '@game/entities/tile/tileEntityFactory'
import { VineFactory } from '@game/entities/tile/vineFactory'
import { WallFactory } from '@game/entities/tile/wallFactory'
import { assert } from '@utils/assertion'
import { Random } from '@utils/random'
import { TileSet, TileLayer } from './mapBuilder'

type Build = (pos: Vec2, tileSize: Vec2, frame: number, layer: TileLayer) => void
type Builder = { firstgid: number; build: Build }

export class TileLayerFactory {
  private builders: Array<Builder>
  private rand = new Random()

  constructor(private world: World, tileSets: Array<TileSet>) {
    this.builders = this.loadBuilders(tileSets)
  }

  public build(layer: TileLayer, tileSize: Vec2): void {
    const findBuilder = (tileId: number): Builder => {
      for (let i = 0; i < this.builders.length; i++) {
        if (tileId < this.builders[i].firstgid) continue
        if (i < this.builders.length - 1 && this.builders[i + 1].firstgid <= tileId) continue
        return this.builders[i]
      }
      assert(false, `Could not find appropriate builder for tileId ${tileId}`)
    }

    for (let x = 0; x < layer.width; x++) {
      for (let y = 0; y < layer.height; y++) {
        const tileId = this.getTileId(layer, x, y)
        if (tileId === 0) continue
        const builder = findBuilder(tileId)
        builder.build(new Vec2(x, y), tileSize, tileId - builder.firstgid, layer)
      }
    }
  }

  private loadBuilders(tileSets: Array<TileSet>): Array<Builder> {
    const builders = new Array<Builder>()
    const factories: {
      [keys: string]: new (
        pos: Vec2,
        name: string,
        frame: number,
        world: World
      ) => TileEntityFactory
    } = {
      balloonvine: BalloonVineFactory,
      dandelion: DandelionFactory,
      enemy1: Enemy1Factory,
      moss: MossFactory,
      slime1: Slime1Factory,
      snibee: SnibeeFactory,
      throughFloor: ThroughFloorFactory,
      vine: VineFactory,
    }
    for (const { firstgid, source } of tileSets) {
      const { name, tilewidth, tileheight } = require(`../../../res/map/${source}`) // eslint-disable-line  @typescript-eslint/no-var-requires
      const objectSize = new Vec2(tilewidth, tileheight)
      switch (name) {
        case 'wall':
          builders.push({
            firstgid,
            build: (pos: Vec2, tileSize: Vec2, _: number, layer: TileLayer) =>
              this.buildWall(layer, pos, tileSize, objectSize, firstgid),
          })
          break
        default:
          builders.push({
            firstgid,
            build: (pos: Vec2, tileSize: Vec2, frame: number) =>
              this.world.addEntity(
                new factories[name](
                  new Vec2(
                    pos.x * tileSize.x + objectSize.x / 2,
                    (pos.y + 1) * tileSize.y - objectSize.y / 2
                  ),
                  name,
                  frame,
                  this.world
                ).create()
              ),
          })
          break
      }
    }
    return builders
  }

  private buildWall(
    layer: TileLayer,
    pos: Vec2,
    tileSize: Vec2,
    objectSize: Vec2,
    firstgid: number
  ): void {
    const factory = new WallFactory(
      new Vec2(pos.x * tileSize.x + objectSize.x / 2, (pos.y + 1) * tileSize.y - objectSize.y / 2)
    )
    const cells = []
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        const xi = pos.x + i - 1
        const yj = pos.y + j - 1
        cells.push(this.getTileId(layer, xi, yj))
      }
    }
    factory.tileId = this.calcWallId(cells) - firstgid
    factory.shouldCollide = cells.some(c => c === 0)
    this.world.addEntity(factory.create())
  }

  private getTileId(layer: TileLayer, x: number, y: number): number {
    if (x < 0) return 0
    if (y < 0) return 0
    if (x >= layer.width) return 0
    if (y >= layer.height) return 0
    return layer.data[x + y * layer.width]
  }

  private calcWallId(cell: number[]): number {
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
