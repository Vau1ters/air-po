import { Entity } from '@core/ecs/entity'
import { getSpriteBuffer } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import {
  buildCollider,
  ColliderComponent,
  GeometryBuildOption,
} from '@game/components/colliderComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { StaticComponent } from '@game/components/staticComponent'
import { Category } from '@game/entities/category'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'
import { Sprite } from 'pixi.js'
import wallType from '@res/misc/wall.json'
import { assert } from '@utils/assertion'

type WallType = keyof typeof wallType.typeMap

export default class WallFactory extends TileEntityFactory {
  public create(): Entity {
    const typeIndex = Object.values(wallType.typeMap).findIndex(frames =>
      frames.includes(this.frame)
    )
    assert(typeIndex !== -1, `wall index ${this.frame} is invalid`)
    const type = Object.keys(wallType.typeMap)[typeIndex] as WallType
    const nonCollidableTypes: Array<WallType> = [
      'CompletelyFilled',
      'LackCornerLeftDown',
      'LackCornerLeftUp',
      'LackCornerRightDown',
      'LackCornerRightUp',
      'Invalid',
    ]
    const shouldCollide = !nonCollidableTypes.includes(type)
    const entity = super.create()
    if (shouldCollide) {
      const geometry = ((): GeometryBuildOption => {
        switch (type) {
          case 'SlopeLeftUp':
            return { type: 'Slope', size: new Vec2(8, 8), normal: new Vec2(-1, -1) }
          case 'SlopeRightUp':
            return { type: 'Slope', size: new Vec2(8, 8), normal: new Vec2(+1, -1) }
          case 'SlopeRightDown':
            return { type: 'Slope', size: new Vec2(8, 8), normal: new Vec2(+1, +1) }
          case 'SlopeLeftDown':
            return { type: 'Slope', size: new Vec2(8, 8), normal: new Vec2(-1, +1) }
          default:
            return { type: 'AABB', size: new Vec2(8, 8) }
        }
      })()
      const collider = buildCollider({
        entity,
        geometry,
        category: 'terrain',
        mask: new Set<Category>(['physics']),
        tag: ['physics'],
      })
      const solveDirs = {
        LackLeft: [new Vec2(-1, 0)],
        LackRight: [new Vec2(+1, 0)],
        LackUp: [new Vec2(0, -1)],
        LackDown: [new Vec2(0, +1)],
        LackLeftRight: [new Vec2(-1, 0), new Vec2(+1, 0)],
        LackUpDown: [new Vec2(0, -1), new Vec2(0, +1)],
        CornerLeftUp: [new Vec2(-1, 0), new Vec2(0, -1)],
        CornerLeftDown: [new Vec2(-1, 0), new Vec2(0, +1)],
        CornerRightUp: [new Vec2(+1, 0), new Vec2(0, -1)],
        CornerRightDown: [new Vec2(+1, 0), new Vec2(0, +1)],
        ProtrudeLeft: [new Vec2(+1, 0), new Vec2(0, -1), new Vec2(0, +1)],
        ProtrudeRight: [new Vec2(-1, 0), new Vec2(0, -1), new Vec2(0, +1)],
        ProtrudeUp: [new Vec2(-1, 0), new Vec2(+1, 0), new Vec2(0, +1)],
        ProtrudeDown: [new Vec2(-1, 0), new Vec2(+1, 0), new Vec2(0, -1)],
        SlopeLeftUp: [new Vec2(0, -1)],
        SlopeLeftDown: [],
        SlopeRightUp: [new Vec2(0, -1)],
        SlopeRightDown: [],
      }
      assert(type in solveDirs, '')
      collider.option.solveDir = solveDirs[type as keyof typeof solveDirs] as Array<Vec2>
      entity.addComponent('Collider', new ColliderComponent(collider))
    }

    const sprite = new Sprite(getSpriteBuffer('wall').definitions['Default'].textures[this.frame])
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
    entity.addComponent('Static', new StaticComponent())

    return entity
  }
}
