import { World } from './core/ecs/world'
import { PositionComponent } from './core/components/positionComponent'
import DebugDrawSystem from './core/systems/debugDrawSystem'
import { application, initializeApplication } from './core/application'
import PhysicsSystem from './core/systems/physicsSystem'
import GravitySystem from './core/systems/gravitySystem'
import { Container, Graphics } from 'pixi.js'
import DrawSystem from './core/systems/drawSystem'
import { KeyController } from './core/controller'
import { PlayerControlSystem } from './core/systems/playerControlSystem'
import { BulletSystem } from './core/systems/bulletSystem'
import { PlayerFactory } from './core/entities/playerFactory'
import { WallFactory } from './core/entities/wallFactory'
import { AirFilter } from './filters/airFilter'
import * as Art from './core/graphics/art'
import { Enemy1Factory } from './core/entities/enemy1Factory'
import { BehaviourTree } from './core/ai/behaviourTree'
import { SequenceNode } from './core/ai/composite/sequenceNode'
import { Move, Direction } from './core/ai/action/move'
import { AIComponent } from './core/components/aiComponent'
import AISystem from './core/systems/aiSystem'
import { WhileNode } from './core/ai/decorator/whileNode'
import { TrueNode } from './core/ai/condition/boolNode'
import { ParallelNode } from './core/ai/composite/parallelNode'
import InvincibleSystem from './core/systems/invincibleSystem'
import { DamageSystem } from './core/systems/damageSystem'

export class Main {
  public static world = new World()
  /*+.† INITIALIZATION †.+*/
  public static init(): void {
    initializeApplication()
    KeyController.init()
    Art.init()

    // air
    const airFilter = new AirFilter({ x: 800, y: 600 })
    airFilter.airs = [
      {
        center: {
          x: 600,
          y: 250,
        },
        radius: 80,
      },
      {
        center: {
          x: 400,
          y: 300,
        },
        radius: 100,
      },
    ]
    application.stage.filters = [airFilter]
    const bg = new Graphics()
    bg.beginFill(0x000000, 0)
    bg.drawRect(0, 0, 800, 600)
    bg.endFill()
    application.stage.addChild(bg)

    const debugContainer = new Container()
    debugContainer.zIndex = Infinity
    application.stage.addChild(debugContainer)

    this.world.addSystem(
      new AISystem(this.world),
      new PhysicsSystem(this.world),
      new GravitySystem(this.world),
      new PlayerControlSystem(this.world),
      new BulletSystem(this.world),
      new InvincibleSystem(this.world),
      new DamageSystem(this.world),
      new DrawSystem(this.world, application.stage),
      new DebugDrawSystem(this.world, debugContainer)
    )

    // 主人公
    const player = new PlayerFactory().create()
    const position = player.getComponent('Position') as PositionComponent
    position.x = 100
    position.y = 50
    this.world.addEntity(player)

    // 敵
    const enemy1 = new Enemy1Factory().create()
    const enemyPosition = enemy1.getComponent('Position') as PositionComponent
    enemyPosition.x = 160
    enemyPosition.y = 140
    this.world.addEntity(enemy1)

    // 壁
    for (let x = 0; x < 50; x++) {
      const wall = new WallFactory().create()
      const p = wall.getComponent('Position') as PositionComponent
      p.x = 8 * x
      if (x < 16) {
        p.y = 50 + 8 * x
      } else {
        p.y = 178
      }
      this.world.addEntity(wall)
    }

    const enemyAI = new ParallelNode([
      new WhileNode({
        cond: new TrueNode(),
        exec: new SequenceNode([
          new Move(Direction.Right, 2, 60),
          new Move(Direction.Left, 2, 60),
        ]),
      }),
    ])
    const tree = new BehaviourTree(enemyAI)
    enemy1.addComponent('AI', new AIComponent(tree))

    application.ticker.add((delta: number) => this.world.update(delta / 60))
  }
}
Main.init()
