import { Entity } from '../ecs/entity'

export abstract class EntityFactory {
  public abstract create(): Entity
}
