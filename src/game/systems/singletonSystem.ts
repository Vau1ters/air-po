import { ComponentName } from '@core/ecs/component.autogen'
import { Entity } from '@core/ecs/entity'
import { Family, FamilyBuilder } from '@core/ecs/family'
import { System } from '@core/ecs/system'
import { World } from '@core/ecs/world'
import { assert } from '@utils/assertion'

export class SingletonSystem extends System {
  private families = new Map<ComponentName, Family>()

  public constructor(world: World) {
    super(world)
  }

  public update(): void {}

  public isSingleton<K extends ComponentName>(componentName: K): boolean {
    const family = this.getOrCreateFamily(componentName)
    return family.entityArray.length === 1
  }

  public getSingleton<K extends ComponentName>(componentName: K): Entity {
    const family = this.getOrCreateFamily(componentName)
    assert(family.entityArray.length > 0, `There are no entities with '${componentName}`)
    assert(family.entityArray.length === 1, `There are multiple entities with '${componentName}`)
    return family.entityArray[0]
  }

  private getOrCreateFamily<K extends ComponentName>(componentName: K): Family {
    const family = this.families.get(componentName)
    if (family !== undefined) {
      return family
    }
    const result = new FamilyBuilder(this.world).include(componentName).build()
    this.families.set(componentName, result)
    return result
  }
}

const getSingletonSystem = (world: World): SingletonSystem => {
  const singletonSystem = world.systemArray.find(s => s instanceof SingletonSystem)
  assert(singletonSystem !== undefined, 'SingletonSystem is not found')
  return singletonSystem as SingletonSystem
}

export const isSingleton = <K extends ComponentName>(componentName: K, world: World): boolean => {
  const system = getSingletonSystem(world)
  return system.isSingleton(componentName)
}

export const getSingleton = <K extends ComponentName>(componentName: K, world: World): Entity => {
  const system = getSingletonSystem(world)
  return system.getSingleton(componentName)
}
