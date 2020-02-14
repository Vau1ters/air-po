import { ComponentName, ComponentFactory } from './component'
import { EventNotifier } from '../eventNotifier'

export class Entity {
  private static id = 0

  private readonly _id: number
  private readonly componentMap: Partial<ComponentFactory>
  private readonly componentAddedEvent: EventNotifier<ComponentName>
  private readonly componentRemovedEvent: EventNotifier<ComponentName>

  public constructor() {
    this._id = Entity.id++
    this.componentMap = {}
    this.componentAddedEvent = new EventNotifier()
    this.componentRemovedEvent = new EventNotifier()
  }

  public get id(): number {
    return this._id
  }

  public hasComponent<K extends ComponentName>(componentName: K): boolean {
    return this.componentMap[componentName] !== undefined
  }

  public getComponent<K extends ComponentName>(
    componentName: K
  ): Partial<ComponentFactory>[K] {
    return this.componentMap[componentName]
  }

  public addComponent<K extends ComponentName>(
    componentName: K,
    component: ComponentFactory[K]
  ): void {
    this.componentMap[componentName] = component
    this.componentAddedEvent.notify(componentName)
  }

  public removeComponent<K extends ComponentName>(componentName: K): void {
    delete this.componentMap[componentName]
    this.componentRemovedEvent.notify(componentName)
  }
}
