import { Entity } from './entity'
import { System } from './system'
import { EventNotifier } from '../eventNotifier'

export class World {
  private readonly entities: Set<Entity>
  private readonly systems: Set<System>
  public readonly entityAddedEvent: EventNotifier<Entity>
  public readonly entityRemovedEvent: EventNotifier<Entity>

  public constructor() {
    this.entities = new Set()
    this.systems = new Set()
    this.entityAddedEvent = new EventNotifier()
    this.entityRemovedEvent = new EventNotifier()
  }

  public get entitySet(): Set<Entity> {
    return new Set(this.entities)
  }

  public get entityArray(): Entity[] {
    return Array.from(this.entities)
  }

  // GCによるパフォーマンス低下を防ぐために、できるだけこちらを使う
  public get entityIterator(): IterableIterator<Entity> {
    return this.entities[Symbol.iterator]()
  }

  // GCによるパフォーマンス低下を防ぐために、できるだけこちらを使う
  public forEachEntities(callback: (entity: Entity) => void): void {
    this.entities.forEach(callback)
  }

  public get systemSet(): Set<System> {
    return new Set(this.systems)
  }

  public get systemArray(): System[] {
    return Array.from(this.systems)
  }

  // GCによるパフォーマンス低下を防ぐために、できるだけこちらを使う
  public get systemIterator(): IterableIterator<System> {
    return this.systems[Symbol.iterator]()
  }

  // GCによるパフォーマンス低下を防ぐために、できるだけこちらを使う
  public forEachSystems(callback: (entity: System) => void): void {
    this.systems.forEach(callback)
  }

  public addEntity(...entities: Entity[]): void {
    for (const entity of entities) {
      this.entities.add(entity)
      this.entityAddedEvent.notify(entity)
    }
  }

  public removeEntity(...entities: Entity[]): void {
    for (const entity of entities) {
      this.entities.delete(entity)
      this.entityRemovedEvent.notify(entity)
    }
  }

  public addSystem(...systems: System[]): void {
    for (const system of systems) {
      this.systems.add(system)
    }
  }

  public removeSystem(...systems: System[]): void {
    for (const system of systems) {
      this.systems.delete(system)
    }
  }

  public update(delta: number): void {
    delta = 1 / 60
    this.systems.forEach(system => {
      system.update(delta)
    })
  }
}
