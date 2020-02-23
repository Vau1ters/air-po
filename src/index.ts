import { World } from './core/ecs/world'
import { PositionComponent } from './core/components/positionComponent'
import { RigidBodyComponent } from './core/components/rigidBodyComponent'
import { ColliderComponent } from './core/components/colliderComponent'
import { Entity } from './core/ecs/entity'
import DebugDrawSystem from './core/systems/debugDrawSystem'
import { application, initializeApplication } from './core/application'
import PhysicsSystem from './core/systems/physicsSystem'
import GravitySystem from './core/systems/gravitySystem'
import { Container, Graphics } from 'pixi.js'
import DrawSystem from './core/systems/drawSystem'
import { DrawComponent } from './core/components/drawComponent'
import { Vec2 } from './core/math/vec2'

export class Main {
  public static world = new World()
  /*+.† INITIALIZATION †.+*/
  public static init(): void {
    initializeApplication()

    const debugContainer = new Container()
    debugContainer.zIndex = Infinity
    application.stage.addChild(debugContainer)

    this.world.addSystem(
      new PhysicsSystem(this.world),
      new GravitySystem(this.world),
      new DrawSystem(this.world, application.stage),
      new DebugDrawSystem(this.world, debugContainer)
    )
    const position1 = new PositionComponent(200, 100)
    const body1 = new RigidBodyComponent(10, new Vec2(30, 0), new Vec2(), 1)
    const draw1 = new DrawComponent()
    const entity1 = new Entity()
    const collider1 = new ColliderComponent(entity1)
    collider1.createAABB(new Vec2(100, 100))
    entity1.addComponent('Position', position1)
    entity1.addComponent('RigidBody', body1)
    entity1.addComponent('Draw', draw1)
    entity1.addComponent('Collider', collider1)
    this.world.addEntity(entity1)
    const po1 = new Graphics()
    po1.beginFill(0xffff00)
    po1.drawRect(0, 0, 100, 100)
    draw1.addChild(po1)

    const position2 = new PositionComponent(400, 300)
    const body2 = new RigidBodyComponent(0, new Vec2(-20, -100), new Vec2(), 1)
    // 質量無限大
    body2.invMass = 0
    const draw2 = new DrawComponent()
    const entity2 = new Entity()
    const collider2 = new ColliderComponent(entity2)
    collider2.createAABB(new Vec2(100, 100))
    entity2.addComponent('Position', position2)
    entity2.addComponent('RigidBody', body2)
    entity2.addComponent('Draw', draw2)
    entity2.addComponent('Collider', collider2)
    this.world.addEntity(entity2)
    const po2 = new Graphics()
    po2.beginFill(0xff00ff)
    po2.drawRect(0, 0, 100, 100)
    draw2.addChild(po2)

    application.ticker.add((delta: number) => this.world.update(delta / 60))
  }
}
Main.init()
