import * as PIXI from 'pixi.js'
import { System } from './core/ecs/system'
import { World } from './core/ecs/world'
import { Family, FamilyBuilder } from './core/ecs/family'
import { VelocityComponent, PositionComponent } from './core/ecs/component'
import { Entity } from './core/ecs/entity'

const windowOption = {
  width: 800,
  height: 600,
}
const app = new PIXI.Application({
  ...windowOption,
})
const graphics = new PIXI.Graphics()
app.stage.addChild(graphics)

class PhysicsSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world)
      .include('Position', 'Velocity')
      .build()
  }

  public update(delta: number): void {
    for (const entity of this.family.entities) {
      const position = entity.getComponent('Position') as PositionComponent
      const velocity = entity.getComponent('Velocity') as VelocityComponent
      position.x += velocity.x * delta
      position.y += velocity.y * delta
    }
  }
}

class GravitySystem extends System {
  private family: Family
  private acceleration = 50

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Velocity').build()
  }

  public update(delta: number): void {
    for (const entity of this.family.entities) {
      const velocity = entity.getComponent('Velocity') as VelocityComponent
      velocity.y += this.acceleration * delta
    }
  }
}

class DrawSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Position').build()
  }

  public update(): void {
    graphics.clear()
    for (const entity of this.family.entities) {
      const position = entity.getComponent('Position') as PositionComponent
      graphics.beginFill(0xff0000)
      graphics.drawRect(position.x - 10, position.y - 10, 20, 20)
    }
    graphics.endFill()
  }
}

const container = document.getElementById('container')
if (container) {
  container.appendChild(app.view)

  const onResizeCallback = (): void => {
    const rect = container.getBoundingClientRect()
    const scale = Math.min(
      rect.width / windowOption.width,
      rect.height / windowOption.height
    )
    app.stage.scale.set(scale)
    app.renderer.resize(windowOption.width * scale, windowOption.height * scale)
  }
  onResizeCallback()
  window.addEventListener('resize', onResizeCallback)

  const world = new World()
  world.addSystem(
    new PhysicsSystem(world),
    new GravitySystem(world),
    new DrawSystem(world)
  )
  app.ticker.add(delta => world.update(delta / 60))

  const position1 = new PositionComponent(200, 100)
  const velocity1 = new VelocityComponent(30, 0)
  const entity1 = new Entity()
  entity1.addComponent('Position', position1)
  entity1.addComponent('Velocity', velocity1)
  world.addEntity(entity1)

  const position2 = new PositionComponent(500, 300)
  const velocity2 = new VelocityComponent(-20, -100)
  const entity2 = new Entity()
  entity2.addComponent('Position', position2)
  entity2.addComponent('Velocity', velocity2)
  world.addEntity(entity2)
}
