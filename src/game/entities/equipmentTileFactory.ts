import { buildCollider, ColliderComponent } from '@game/components/colliderComponent'
import { PositionComponent } from '@game/components/positionComponent'
import { SensorComponent } from '@game/components/sensorComponent'
import { Entity } from '@core/ecs/entity'
import { Vec2 } from '@core/math/vec2'
import { Category, CategorySet } from './category'
import { EntityFactory } from './entityFactory'
import { EquipmentTypes } from '@game/components/equipmentComponent'
import { parseAnimation } from '@core/graphics/animationParser'
import equipmentDefinition from '@res/animation/equipment.json'
import { DrawComponent } from '@game/components/drawComponent'

export class EquipmentTileFactory extends EntityFactory {
  private position = new Vec2(0, 0)
  private size = new Vec2(0, 0)
  private equipmentType: EquipmentTypes = 'AirTank'

  public create(): Entity {
    const entity = new Entity()

    const sprite = parseAnimation(equipmentDefinition.sprite)
    sprite.changeTo(this.equipmentType)
    const draw = new DrawComponent(entity)
    draw.addChild(sprite)
    entity.addComponent('Draw', draw)
    entity.addComponent(
      'Collider',
      new ColliderComponent(
        buildCollider({
          entity,
          geometry: {
            type: 'AABB',
            offset: new Vec2(-this.size.x / 2, -this.size.y / 2),
            size: new Vec2(this.size.x, this.size.y),
          },
          category: Category.SENSOR,
          mask: new CategorySet(Category.SENSOR),
        })
      )
    )
    entity.addComponent(
      'Sensor',
      new SensorComponent(`equipItem ${this.equipmentType} ${entity.id}`)
    )
    entity.addComponent(
      'Position',
      new PositionComponent(this.position.x + this.size.x / 2, this.position.y - this.size.y)
    )

    return entity
  }

  public setPosition(x: number, y: number): this {
    this.position = new Vec2(x, y)
    return this
  }

  public setSize(width: number, height: number): this {
    this.size = new Vec2(width, height)
    return this
  }

  public setEquipmentType(type: EquipmentTypes): this {
    this.equipmentType = type
    return this
  }
}
