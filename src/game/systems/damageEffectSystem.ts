import { System } from '@core/ecs/system'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import damageShader from '@res/shaders/damage.frag'
import { Filter } from 'pixi.js'

export class DamageEffectSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Hp', 'Draw').build()
    this.family.entityAddedEvent.addObserver((entity: Entity) => this.entityAdded(entity))
  }

  public update(): void {
    for (const entity of this.family.entityIterator) {
      const hp = entity.getComponent('Hp')
      const [filter] = entity.getComponent('Draw').filters || []
      if (hp.damageTime > 0) {
        filter.uniforms.damaging = true
        hp.damageTime--
      } else {
        filter.uniforms.damaging = false
      }
    }
  }

  private entityAdded(entity: Entity): void {
    const draw = entity.getComponent('Draw')
    draw.filters = [new Filter(undefined, damageShader, { damaging: false })]
  }
}
