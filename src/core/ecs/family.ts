import { Entity } from './entity'
import { ComponentName } from './component'
import { World } from './world'

export class Family {
  private readonly world: World
  private readonly includeComponents: Set<ComponentName>
  private readonly excludeComponents: Set<ComponentName>
  private readonly _entities: Set<Entity>

  public constructor(
    world: World,
    includeComponents: Set<ComponentName>,
    excludeComponents: Set<ComponentName>
  ) {
    this.world = world
    this.includeComponents = includeComponents
    this.excludeComponents = excludeComponents
    this._entities = new Set()

    this.addEntitiesBySet(this.world.entities)
    this.world.entityAddedEvent.addObserver((entity: Entity): void => {
      this.onEntityAdded(entity)
    })
    this.world.entityRemovedEvent.addObserver((entity: Entity): void => {
      this.onEntityRemoved(entity)
    })
  }

  public get entities(): Set<Entity> {
    return new Set(this._entities)
  }

  private onEntityAdded(entity: Entity): void {
    entity.componentChangedEvent.addObserver((entity): void => {
      this.onEntityChanged(entity)
    })
    if (this.includesEntity(entity)) {
      this._entities.add(entity)
    }
  }

  private onEntityRemoved(entity: Entity): void {
    this.entities.delete(entity)
  }

  private onEntityChanged(entity: Entity): void {
    if (this.includesEntity(entity)) {
      this.entities.add(entity)
    } else {
      this.entities.delete(entity)
    }
  }

  private addEntitiesBySet(entities: Set<Entity>): void {
    entities.forEach((entity): void => {
      this.onEntityChanged(entity)
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
