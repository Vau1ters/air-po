import { System } from '@core/ecs/system'
import { FamilyBuilder } from '@core/ecs/family'
import { World } from '@core/ecs/world'
import { Container } from 'pixi.js'
import { Entity } from '@core/ecs/entity'

export default class UiSystem extends System {
  private uiContainer: Container = new Container()

  public constructor(world: World, uiContainer: Container) {
    super(world)

    uiContainer.addChild(this.uiContainer)

    const uiFamily = new FamilyBuilder(world).include('UI').build()
    uiFamily.entityAddedEvent.addObserver(entity => this.onContainerAdded(entity))
    uiFamily.entityRemovedEvent.addObserver(entity => this.onContainerRemoved(entity))
  }

  private onContainerAdded(entity: Entity): void {
    const container = entity.getComponent('UI')
    this.uiContainer.addChild(container)
  }

  private onContainerRemoved(entity: Entity): void {
    if (entity.hasComponent('UI')) {
      const container = entity.getComponent('UI')
      this.uiContainer.removeChild(container)
    }
  }

  public update(): void {}
}
