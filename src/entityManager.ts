import Entity from './entity'

export default class EntityManager {
  static list: Array<Entity> // 全Entityのリスト
  static init(): void {
    this.list = new Array<Entity>()
  }
  static add(entity: Entity): void {
    console.log('add:', entity)
    this.list.push(entity)
  }
  static remove(entity: Entity): void {
    console.log('remove:', entity)
  }
}
