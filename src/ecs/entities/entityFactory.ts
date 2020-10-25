import { Entity } from '../entity'

export abstract class EntityFactory {
  public abstract create(): Entity
}
