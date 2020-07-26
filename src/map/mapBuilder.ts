import { World } from '../core/ecs/world'
import { WallFactory } from '../core/entities/wallFactory'
import { Random } from '../utils/random'
import { AirFactory } from '../core/entities/airFactory'
import { EnemyFactory } from '../core/entities/enemyFactory'
import { PlayerFactory } from '../core/entities/playerFactory'
import { assert } from '../utils/assertion'

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
          this.buildEnemy(layer)
          break
        case 'player':
          this.buildPlayer(layer)
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
        .setQuantity(radius)
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
            if (0 <= xi && xi < mapLayer.width && 0 <= yj && yj < mapLayer.height) {
              cells.push(mapLayer.data[xi + yj * mapLayer.width])
            } else {
              cells.push(0)
            }
          }
        }
        factory.tileId = this.calcId(cells) - wallTileSet.firstgid
        factory.shouldCollide = cells.some(c => c === 0)
        const wall = factory.create()
        const p = wall.getComponent('Position')
        p.x = 8 * x
        p.y = 8 * y
        this.world.addEntity(wall)
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildEnemy(enemyLayer: any): void {
    for (const enemyData of enemyLayer.objects) {
      const enemy = new EnemyFactory(this.world).setType(enemyData.type).create()
      const enemyPosition = enemy.getComponent('Position')
      enemyPosition.x = enemyData.x + enemyData.width / 2
      enemyPosition.y = enemyData.y - enemyData.height / 2
      this.world.addEntity(enemy)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildPlayer(playerLayer: any): void {
    assert(playerLayer.objects.length === 1)
    for (const playerData of playerLayer.objects) {
      const player = new PlayerFactory(this.world).create()
      const playerPosition = player.getComponent('Position')
      playerPosition.x = playerData.x + playerData.width / 2
      playerPosition.y = playerData.y - playerData.height / 2
      this.world.addEntity(player)
    }
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
