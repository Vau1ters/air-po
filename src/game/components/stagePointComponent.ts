import { Entity } from '@core/ecs/entity'
import { StageName } from '@game/stage/stageLoader'
import { hash } from '@utils/hash'

export type StagePointID = number
export type StagePoint = {
  stageName: StageName
  pointID: StagePointID
}

export class StagePointComponent {
  constructor(public readonly stagePoint: StagePoint) {}

  static autoGenerate(entity: Entity, stageName: StageName): StagePointComponent {
    const pos = entity.getComponent('Position')
    const pointID = hash([stageName, pos.x, pos.y])
    return new StagePointComponent({ stageName, pointID })
  }
}
