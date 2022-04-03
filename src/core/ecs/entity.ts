import { ComponentName, ComponentMap } from './component.autogen'
import { EventNotifier } from '@utils/eventNotifier'
import { assert } from '@utils/assertion'

export class Entity {
  private static id = 0

  private readonly _id: number
  private readonly componentMap: Partial<ComponentMap>
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

  public getComponent<K extends ComponentName>(componentName: K): ComponentMap[K] {
    const result = this.componentMap[componentName] as ComponentMap[K]
    assert(result, `Missing component '${componentName}'`)
    return result
  }

  public addComponent<K extends ComponentName>(componentName: K, component: ComponentMap[K]): void {
    this.componentMap[componentName] = component
    this.componentChangedEvent.notify(this)
  }

  public removeComponent<K extends ComponentName>(componentName: K): void {
    this.componentChangedEvent.notify(this)
    delete this.componentMap[componentName]
  }
}
