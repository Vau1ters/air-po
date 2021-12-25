import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { ColliderComponent } from '@game/components/colliderComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { assert } from '@utils/assertion'
import { EntityFactory } from './entityFactory'
import { loadColliderComponent } from './loader/component/ColliderComponentLoader'
import { EntityName, loadEntity } from './loader/EntityLoader'

export type TileColliderGeometry =
  | { type: 'AABB'; size: [number, number]; solveDir: Array<[number, number]> }
  | {
      type: 'Slope'
      size: [number, number]
      normal: [number, number]
      solveDir: Array<[number, number]>
    }

export type TileCollider = {
  index: number
  geometry?: TileColliderGeometry
}

export class TileEntityFactory extends EntityFactory {
  constructor(private pos: Vec2, private name: EntityName, protected frame: number) {
    super()
  }

  public create(): Entity {
    const entity = loadEntity(this.name)
    entity.addComponent('Position', new PositionComponent(this.pos.x, this.pos.y))
    return entity
  }

  protected createCollider(
    entity: Entity,
    colliderSettings: Array<TileCollider>
  ): ColliderComponent | undefined {
    const colliderSetting = colliderSettings.find(c => c.index === this.frame)
    assert(colliderSetting !== undefined, `collider setting not found for index = ${this.frame}`)
    const geometrySetting = colliderSetting.geometry
    if (geometrySetting) {
      switch (geometrySetting.type) {
        case 'AABB':
          return loadColliderComponent(
            [
              {
                geometry: {
                  type: 'AABB',
                  size: geometrySetting.size,
                  offset: undefined,
                  maxClipToTolerance: undefined,
                },
                category: 'terrain',
                mask: ['physics'],
                tag: ['physics'],
                solveDir: geometrySetting.solveDir,
              },
            ],
            entity
          )
        case 'Slope':
          assert(geometrySetting.normal, '')
          return loadColliderComponent(
            [
              {
                geometry: {
                  type: 'Slope',
                  size: geometrySetting.size,
                  normal: geometrySetting.normal,
                },
                category: 'terrain',
                mask: ['physics'],
                tag: ['physics'],
                solveDir: geometrySetting.solveDir,
              },
            ],
            entity
          )
      }
    }
    return undefined
  }
}
