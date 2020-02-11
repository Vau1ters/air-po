import Renderer from './renderer'
import Entity from './entity'
import EntityManager from './entityManager'

class Main {
  static init(): void {
    Renderer.init()
    EntityManager.init()

    const ent = new Entity()
    EntityManager.add(ent)

    this.update()
  }
  static update(): void {
    requestAnimationFrame(Main.update)
  }
}
Main.init()
