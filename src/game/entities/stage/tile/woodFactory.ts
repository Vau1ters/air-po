import { Entity } from '@core/ecs/entity'
import { StaticComponent } from '@game/components/staticComponent'
import { TileEntityFactory } from '@game/entities/tileEntityFactory'
import { assert } from '@utils/assertion'
import woodCollider from '@res/collider/wood.json'
import { loadColliderComponent } from '@game/entities/loader/component/ColliderComponentLoader'
import { getSpriteBuffer } from '@core/graphics/art'
import { DrawComponent } from '@game/components/drawComponent'
import { Sprite } from 'pixi.js'

export default class WoodFactory extends TileEntityFactory {
  public create(): Entity {
    const colliderSetting = woodCollider.find(c => c.index === this.frame)
    assert(colliderSetting !== undefined, `collider setting not found for index = ${this.frame}`)
    const geometrySetting = colliderSetting.geometry
    const entity = super.create()
    if (geometrySetting) {
      switch (geometrySetting.type) {
        case 'AABB':
          entity.addComponent(
            'Collider',
            loadColliderComponent(
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
          )
          break
        case 'Slope':
          assert(geometrySetting.normal, '')
          entity.addComponent(
            'Collider',
            loadColliderComponent(
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
          )
          break
      }
    }
    const sprite = new Sprite(getSpriteBuffer('wood').definitions['Default'].textures[this.frame])
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
