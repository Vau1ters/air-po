import { System } from '../ecs/system'
import { Family, FamilyBuilder } from '../ecs/family'
import { World } from '../ecs/world'
import { KeyController } from '../controller'
import { PlayerComponent } from '../components/playerComponent'

export class PlayerControlSystem extends System {
  private family: Family

  public constructor(world: World) {
    super(world)

    this.family = new FamilyBuilder(world).include('Player').build()
  }

  public update(): void {
    for (const entity of this.family.entities) {
      const player = entity.getComponent('Player') as PlayerComponent
      console.log(player.jumpState)

      const position = entity.getComponent('Position')
      if (position) {
        if (position.y > 500) {
          position.y = 500
          player.jumpState = 'Standing'
        } else {
          player.jumpState = 'Jumping'
        }
      }

      const velocity = entity.getComponent('Velocity')
      if (velocity) {
        if (KeyController.isKeyPressing('Right')) {
          if (velocity.x < 200) velocity.x += 20
        }
        if (KeyController.isKeyPressing('Left')) {
          if (velocity.x > -200) velocity.x -= 20
        }
        if (
          KeyController.isKeyPressing('Space') &&
          player.jumpState === 'Standing'
        ) {
          velocity.y = -600
          player.jumpState = 'Jumping'
        }
      }
    }

    KeyController.onUpdateFinished()
  }
}
