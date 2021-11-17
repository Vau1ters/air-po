import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { PositionComponent } from '@game/components/positionComponent'
import { assert } from '@utils/assertion'
import { EventNotifier } from '@utils/eventNotifier'
import { loadEntityUi } from './loader/entityUiLoader'
import { TileLayoutUiSetting } from './loader/tileLayoutLoader'

export class TileLayout {
  public readonly addNotifier = new EventNotifier<Entity>()
  public readonly removeNotifier = new EventNotifier<Entity>()
  private readonly elements: Array<Entity>

  constructor(private world: World, private readonly setting: TileLayoutUiSetting) {
    this.elements = []
    if (setting.fillElements) {
      const [tx, ty] = setting.tileCount
      for (let i = 0; i < tx * ty; i++) {
        this.add()
      }
    }
  }

  private add(): void {
    const [tx, ty] = this.setting.tileCount
    const index = this.elements.length
    const ix = index % tx
    const iy = Math.floor(index / tx)
    const element = loadEntityUi({
      ...this.setting.element,
    })
    const draw = element.getComponent('Draw')
    const { width, height } = draw.getBounds()
    if ('center' in this.setting.layoutOption) {
      const {
        center: [cx, cy],
        size: [sx, sy],
      } = this.setting.layoutOption
      // totalSize = elementSize * maxCount + margin * (maxCount + 1)
      // margin = (totalSize - elementSize * maxCount) / (maxCount + 1)
      const mx = (sx - width * tx) / (tx + 1)
      const my = (sy - height * ty) / (ty + 1)
      element.addComponent(
        'Position',
        new PositionComponent(
          Math.floor(cx - sx / 2 + mx + (mx + width) * ix + width / 2),
          Math.floor(cy - sy / 2 + my + (my + height) * iy + height / 2)
        )
      )
    } else {
      const {
        offset: [ox, oy],
        shift: [sx, sy],
      } = this.setting.layoutOption
      element.addComponent('Position', new PositionComponent(ox + ix * sx, oy + iy * sy))
    }
    this.elements.push(element)
    this.world.addEntity(element)
  }

  private remove(): void {
    const element = this.elements.pop()
    assert(element !== undefined, '')
    this.world.removeEntity(element)
  }

  get maxCount(): number {
    const [cx, cy] = this.setting.tileCount
    return cx * cy
  }

  set count(count: number) {
    assert(count < this.maxCount, '')
    while (count < this.elements.length) {
      this.add()
    }
    while (count > this.elements.length) {
      this.remove()
    }
  }

  get entities(): Array<Entity> {
    return this.elements
  }
}
