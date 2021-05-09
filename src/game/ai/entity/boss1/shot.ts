import { Behaviour } from '@core/behaviour/behaviour'
import { wait } from '@core/behaviour/wait'
import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { BulletFactory } from '@game/entities/bulletFactory'
import { SnibeeSetting } from '../snibee/snibeeAI'
import * as Sound from '@core/sound/sound'
import { FamilyBuilder } from '@core/ecs/family'
import { StemState } from './stem'

const bulletFactory = new BulletFactory()
bulletFactory.speed = 120
bulletFactory.setRange(400)
bulletFactory.offset.y = 4

export const shot = function*(state: StemState, boss: Entity, world: World): Behaviour<void> {
  const [player] = new FamilyBuilder(world).include('Player').build().entityArray
  for (let i = 0; i < 3; i++) {
    const pp = player.getComponent('Position')
    const ep = boss.getComponent('Position')
    const rv = pp.sub(ep)
    bulletFactory.setShooter(boss, 'enemy')
    bulletFactory.setDirection(rv)
    bulletFactory.angle += (Math.random() - 0.5) * SnibeeSetting.angleRange
    bulletFactory.type = 'needle'
    world.addEntity(bulletFactory.create())
    Sound.play('snibee')

    yield* wait(10)
  }
}
