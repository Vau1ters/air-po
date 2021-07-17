import { Entity } from '@core/ecs/entity'
import { getSpriteBuffer } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { StaticComponent } from '@game/components/staticComponent'
import { getTileId, TileLayer } from '@game/map/mapBuilder'
import { Random } from '@utils/random'
import { Sprite } from 'pixi.js'
import { EntityFactory } from '../entityFactory'
import { loadEntity } from '../loader/EntityLoader'

export class WallFactory extends EntityFactory {
  private static rand = new Random()

  private tileId: number
  private shouldCollide: boolean

  constructor(private pos: Vec2, index: Vec2, firstgid: number, layer: TileLayer) {
    super()
    const cells = []
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        const xi = index.x + i - 1
        const yj = index.y + j - 1
        cells.push(getTileId(layer, xi, yj))
      }
    }
    this.tileId = this.calcWallId(cells) - firstgid
    this.shouldCollide = cells.some(c => c === 0)
  }

  public create(): Entity {
    const entity = this.shouldCollide ? loadEntity('wall') : new Entity()

    const sprite = new Sprite(getSpriteBuffer('wall').definitions['Default'].textures[this.tileId])
    sprite.anchor.set(0.5)

    entity.addComponent(
      'Draw',
      new DrawComponent({
        entity,
        child: {
          sprite,
        },
      })
    )
    entity.addComponent('Position', new PositionComponent(this.pos.x, this.pos.y))
    entity.addComponent('Static', new StaticComponent())

    return entity
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
    return candidates[Math.abs(WallFactory.rand.next()) % candidates.length]
  }
}
