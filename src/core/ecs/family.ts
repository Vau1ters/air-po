import { Entity } from './entity'
import { ComponentName } from './component'
import { World } from './world'

export class Family {
  private readonly world: World
  private readonly includeComponents: Set<ComponentName>
  private readonly excludeComponents: Set<ComponentName>
  private readonly _entities: Set<Entity>
  private readonly addEntity: (entity: Entity) => void
  private readonly removeEntity: (entity: Entity) => void

  public constructor(
    world: World,
    includeComponents: Set<ComponentName>,
    excludeComponents: Set<ComponentName>
  ) {
    this.world = world
    this.includeComponents = includeComponents
    this.excludeComponents = excludeComponents
    this._entities = new Set()
    this.addEntity = (entity: Entity): void => {
      if (this.includesEntity(entity)) {
        this._entities.add(entity)
      }
    }
    this.removeEntity = (entity: Entity): void => {
      this._entities.delete(entity)
    }

    this.addEntitiesBySet(this.world.entities)
    this.world.onEntityAdded(this.addEntity)
    this.world.onEntityRemoved(this.removeEntity)
  }

  public get entities(): Set<Entity> {
    return new Set(this._entities)
  }

  private addEntitiesBySet(entities: Set<Entity>): void {
    entities.forEach((entity): void => {
      if (this.includesEntity(entity)) {
        this._entities.add(entity)
      }
    })
  }

  private includesEntity(entity: Entity): boolean {
    for (const component of this.includeComponents.values()) {
      if (!entity.hasComponent(component)) {
        return false
      }
    }
    for (const component of this.excludeComponents.values()) {
      if (entity.hasComponent(component)) {
        return false
      }
    }
    return true
  }
}

export class FamilyBuilder {
  private readonly world: World
  private readonly includeComponents: Set<ComponentName>
  private readonly excludeComponents: Set<ComponentName>

  public constructor(world: World) {
    this.world = world
    this.includeComponents = new Set()
    this.excludeComponents = new Set()
  }

  include(...componentNames: ComponentName[]): void {
    for (const componentName of componentNames) {
      this.includeComponents.add(componentName)
    }
  }

  exclude(...componentNames: ComponentName[]): void {
    for (const componentName of componentNames) {
      this.excludeComponents.add(componentName)
    }
  }

  build(): Family {
    return new Family(
      this.world,
      this.includeComponents,
      this.excludeComponents
    )
  }
}
