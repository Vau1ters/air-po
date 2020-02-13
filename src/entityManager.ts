import Entity from './Entity/entity'
import Renderer from './renderer'

export default class EntityManager {
  static list: Array<Entity> // list of all entities 
  static init(): void {
    this.list = new Array<Entity>()
  }
  static add(entity: Entity): void {
    this.list.push(entity)
    Renderer.add(entity.sprite)
  }
  /*
  static remove(entity: Entity): void {
  }
  */
  static update(): void {
    // update all entities
    this.list.forEach(e => e.update())
  }
}
