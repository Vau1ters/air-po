import { Entity } from './entity'
import { System } from './system'
import { EventNotifier } from '../eventNotifier'

export class World {
  private readonly _entities: Set<Entity>
  private readonly _systems: Set<System>
  public readonly entityAddedEvent: EventNotifier<Entity>
  public readonly entityRemovedEvent: EventNotifier<Entity>

  public constructor() {
    this._entities = new Set()
    this._systems = new Set()
    this.entityAddedEvent = new EventNotifier()
    this.entityRemovedEvent = new EventNotifier()
  }

  public get entities(): Set<Entity> {
    return new Set(this._entities)
  }

  // GCによるパフォーマンス低下を防ぐために、できるだけこちらを使う
  public get entityIterator(): IterableIterator<Entity> {
    return this._entities[Symbol.iterator]()
  }

  // GCによるパフォーマンス低下を防ぐために、できるだけこちらを使う
  public forEachEntities(callback: (entity: Entity) => void): void {
    this._entities.forEach(callback)
  }

  public get systems(): Set<System> {
    return new Set(this._systems)
  }

  // GCによるパフォーマンス低下を防ぐために、できるだけこちらを使う
  public get systemIterator(): IterableIterator<System> {
    return this._systems[Symbol.iterator]()
  }

  // GCによるパフォーマンス低下を防ぐために、できるだけこちらを使う
  public forEachSystems(callback: (entity: System) => void): void {
    this._systems.forEach(callback)
  }

  public addEntity(...entities: Entity[]): void {
    for (const entity of entities) {
      this._entities.add(entity)
      this.entityAddedEvent.notify(entity)
    }
  }

  public removeEntity(...entities: Entity[]): void {
    for (const entity of entities) {
      this._entities.delete(entity)
      this.entityRemovedEvent.notify(entity)
    }
  }

  public addSystem(...systems: System[]): void {
    for (const system of systems) {
      this._systems.add(system)
    }
  }

  public removeSystem(...systems: System[]): void {
    for (const system of systems) {
      this._systems.delete(system)
    }
  }

  public update(delta: number): void {
    delta = 1 / 60
    this._systems.forEach(system => {
      system.update(delta)
    })
  }
}
