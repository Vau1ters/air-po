import { Entity } from '@core/ecs/entity'
import { getSpriteBuffer, SpriteName } from '@core/graphics/art'
import { Vec2 } from '@core/math/vec2'
import { ColliderComponent } from '@game/components/colliderComponent'
import { DrawComponent } from '@game/components/drawComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { assert } from '@utils/assertion'
import { Sprite } from 'pixi.js'
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

export type TileMapping = {
  src: number
  dst: number
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

  protected createDrawComponent(
    entity: Entity,
    spriteName: SpriteName,
    tileMappings?: Array<TileMapping>
  ): DrawComponent {
    const sprite = new Sprite(
      getSpriteBuffer(spriteName).definitions['Default'].textures[
        this.mapIndex(this.frame, tileMappings)
      ]
    )
    sprite.anchor.set(0.5)

    return new DrawComponent({
      entity,
      child: {
        sprite,
      },
    })
  }

  private mapIndex(index: number, tileMappings?: Array<TileMapping>): number {
    if (tileMappings) {
      const mapping = tileMappings.find(m => m.src === index)
      assert(mapping !== undefined, `tile mapping for src = ${index} is not found`)
      return mapping.dst
    }
    return index
  }
}
