import { ComponentName, ComponentFactory } from './component'
import { EventNotifier } from '../eventNotifier'

export class Entity {
  private static id = 0

  private readonly _id: number
  private readonly componentMap: Partial<ComponentFactory>
  public readonly componentChangedEvent: EventNotifier<Entity>

  public constructor() {
    this._id = Entity.id++
    this.componentMap = {}
    this.componentChangedEvent = new EventNotifier()
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
    this.componentChangedEvent.notify(this)
  }

  public removeComponent<K extends ComponentName>(componentName: K): void {
    delete this.componentMap[componentName]
    this.componentChangedEvent.notify(this)
  }
}
