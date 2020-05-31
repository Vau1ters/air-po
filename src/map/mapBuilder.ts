import { World } from '../core/ecs/world'
import { WallFactory } from '../core/entities/wallFactory'
import { PositionComponent } from '../core/components/positionComponent'
import { Random } from '../utils/random'
import { AirFactory } from '../core/entities/airFactory'
import { Enemy1Factory } from '../core/entities/enemy1Factory'
import { BehaviourTree } from '../core/ai/behaviourTree'
import { SequenceNode } from '../core/ai/composite/sequenceNode'
import { MoveNode, Direction } from '../core/ai/action/moveNode'
import { AIComponent } from '../core/components/aiComponent'
import { WhileNode } from '../core/ai/decorator/whileNode'
import { TrueNode } from '../core/ai/condition/boolNode'
import { ParallelNode } from '../core/ai/composite/parallelNode'

export class MapBuilder {
  private world: World
  private rand: Random

  public constructor(world: World) {
    this.world = world
    this.rand = new Random()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public build(map: any): void {
    // layerごとに分ける
    for (const layer of map.layers) {
      switch (layer.name) {
        case 'air':
          this.buildAir(layer)
          break
        case 'map':
          this.buildMap(layer, map.tilesets)
          break
        case 'enemy':
          this.buildEnemey(layer)
          break
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildAir(airLayer: any): void {
    for (const airData of airLayer.objects) {
      const radius = airData.width / 2
      const x = airData.x + radius
      const y = airData.y + radius
      const air = new AirFactory()
        .setPosition(x, y)
        .setQuantity(radius * radius)
        .create()
      this.world.addEntity(air)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildMap(mapLayer: any, tileSets: any): void {
    const factory = new WallFactory()
    const wallTileSet = tileSets[0]

    for (let x = 0; x < mapLayer.width; x++) {
      for (let y = 0; y < mapLayer.height; y++) {
        const tileId = mapLayer.data[x + y * mapLayer.width]
        if (tileId === 0) continue

        const cells = []
        for (let j = 0; j < 3; j++) {
          for (let i = 0; i < 3; i++) {
            const xi = x + i - 1
            const yj = y + j - 1
            if (
              0 <= xi &&
              xi < mapLayer.width &&
              0 <= yj &&
              yj < mapLayer.height
            ) {
              cells.push(mapLayer.data[xi + yj * mapLayer.width])
            } else {
              cells.push(0)
            }
          }
        }
        factory.tileId = this.calcId(cells) - wallTileSet.firstgid
        const wall = factory.create()
        const p = wall.getComponent('Position') as PositionComponent
        p.x = 8 * x
        p.y = 8 * y
        this.world.addEntity(wall)
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildEnemey(enemyLayer: any): void {
    for (const enemyData of enemyLayer.objects) {
      switch (enemyData.type) {
        case 'enemy1':
          this.buildEnemy1(enemyData)
          break
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildEnemy1(enemyData: any): void {
    const enemy1 = new Enemy1Factory().create()
    const enemyPosition = enemy1.getComponent('Position') as PositionComponent
    enemyPosition.x = enemyData.x
    enemyPosition.y = enemyData.y
    this.world.addEntity(enemy1)

    const enemyAI = new ParallelNode([
      new WhileNode({
        cond: new TrueNode(),
        exec: new SequenceNode([
          new MoveNode(Direction.Right, 2, 60),
          new MoveNode(Direction.Left, 2, 60),
        ]),
      }),
    ])
    const tree = new BehaviourTree(enemyAI)
    enemy1.addComponent('AI', new AIComponent(tree))
  }

  private calcId(cell: number[]): number {
    if (
      cell[0] != 0 &&
      cell[1] != 0 &&
      cell[2] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[6] != 0 &&
      cell[7] != 0 &&
      cell[8] != 0
    ) {
      // completely filled
      return this.randomChoice([10, 11, 14, 15, 18, 19, 22, 23])
    }
    if (
      cell[1] != 0 &&
      cell[2] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[6] != 0 &&
      cell[7] != 0 &&
      cell[8] != 0
    ) {
      // lack left up
      return 32
    }
    if (
      cell[0] != 0 &&
      cell[1] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[6] != 0 &&
      cell[7] != 0 &&
      cell[8] != 0
    ) {
      // lack right up
      return 29
    }
    if (
      cell[0] != 0 &&
      cell[1] != 0 &&
      cell[2] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[7] != 0 &&
      cell[8] != 0
    ) {
      // lack left down
      return 8
    }
    if (
      cell[0] != 0 &&
      cell[1] != 0 &&
      cell[2] != 0 &&
      cell[3] != 0 &&
      cell[5] != 0 &&
      cell[6] != 0 &&
      cell[7] != 0
    ) {
      // lack right down
      return 5
    }
    if (cell[1] == 0 && cell[3] == 0 && cell[5] != 0 && cell[7] != 0) {
      // left up corner
      return 1
    }
    if (cell[1] == 0 && cell[3] != 0 && cell[5] == 0 && cell[7] != 0) {
      // right up corner
      return 4
    }
    if (cell[1] != 0 && cell[3] == 0 && cell[5] != 0 && cell[7] == 0) {
      // left down corner
      return 25
    }
    if (cell[1] != 0 && cell[3] != 0 && cell[5] == 0 && cell[7] == 0) {
      // right down corner
      return 28
    }
    if (cell[1] == 0) {
      // up
      return this.randomChoice([2, 3, 30, 31])
    }
    if (cell[3] == 0) {
      // left
      return this.randomChoice([9, 17, 16, 24])
    }
    if (cell[5] == 0) {
      // right
      return this.randomChoice([12, 20, 13, 21])
    }
    if (cell[7] == 0) {
      // down
      return this.randomChoice([26, 27, 6, 7])
    }
    return 1
  }

  private randomChoice(candidates: number[]): number {
    return candidates[Math.abs(this.rand.next()) % candidates.length]
  }
}
