import { Entity } from '@core/ecs/entity'

export abstract class EntityFactory {
  public abstract create(): Entity
}
