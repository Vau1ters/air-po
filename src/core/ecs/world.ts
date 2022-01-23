import { Entity } from './entity'
import { System } from './system'
import { EventNotifier } from '@utils/eventNotifier'
import { Container } from 'pixi.js'
import { application } from '@core/application'
import { ProcessManager } from '@core/process/processManager'

export class World {
  private readonly entities: Set<Entity>
  private readonly entityRemoveQueue: Set<Entity>
  private readonly systems: Set<System>
  public readonly processManager: ProcessManager
  public readonly stage: Container
  public readonly entityAddedEvent: EventNotifier<Entity>
  public readonly entityRemovedEvent: EventNotifier<Entity>

  public constructor() {
    this.entities = new Set()
    this.entityRemoveQueue = new Set()
    this.systems = new Set()
    this.processManager = new ProcessManager()
    this.stage = new Container()
    this.entityAddedEvent = new EventNotifier()
    this.entityRemovedEvent = new EventNotifier()
  }

  public *execute(): Generator<void> {
    application.stage.addChild(this.stage)
    while (true) {
      this.processManager.execute()
      for (const entity of this.entityRemoveQueue) {
        this.entities.delete(entity)
        this.entityRemovedEvent.notify(entity)
      }
      this.entityRemoveQueue.clear()
      yield
    }
  }

  public end(): void {
    application.stage.removeChild(this.stage)
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

  public addEntity(...entities: Entity[]): void {
    for (const entity of entities) {
      this.entities.add(entity)
      this.entityAddedEvent.notify(entity)
    }
  }

  public removeEntity(...entities: Entity[]): void {
    for (const entity of entities) {
      this.entityRemoveQueue.add(entity)
    }
  }

  public getEntityById(id: number): Entity | undefined {
    for (const entity of this.entities) {
      if (entity.id === id) return entity
    }
    return undefined
  }

  public removeEntityById(id: number): void {
    for (const entity of this.entities) {
      if (entity.id === id) this.removeEntity(entity)
    }
  }

  public hasEntity(entity: Entity): boolean {
    return this.entities.has(entity)
  }

  public addSystem(...systems: System[]): void {
    for (const system of systems) {
      system.init()
      this.systems.add(system)
      this.processManager.addProcess(system.updateProcess)
    }
  }

  public removeSystem(...systems: System[]): void {
    for (const system of systems) {
      this.systems.delete(system)
      this.processManager.removeProcess(system.updateProcess)
    }
  }
}
