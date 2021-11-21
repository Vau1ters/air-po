import { Entity } from '@core/ecs/entity'
import { World } from '@core/ecs/world'
import { getTexture, toSpriteName } from '@core/graphics/art'
import { PositionComponent } from '@game/components/positionComponent'
import { toEntityName } from '@game/entities/loader/EntityLoader'
import { entitySetting } from '@game/entities/loader/entitySetting'
import { loadEntityUi } from '@game/entities/ui/loader/entityUiLoader'
import { TileLayoutUiSetting } from '@game/entities/ui/loader/tileLayoutLoader'
import { assert } from '@utils/assertion'

export class TileLayoutComponent {
  private readonly elements: Array<Entity>

  constructor(private world: World, private readonly setting: TileLayoutUiSetting) {
    this.elements = []
    if (setting.fillElements) {
      const [tx, ty] = setting.tileCount
      this.count = tx * ty
    }
  }

  public calcPos(index: number): [number, number] {
    const [tx, ty] = this.setting.tileCount
    const ix = index % tx
    const iy = Math.floor(index / tx)

    if ('center' in this.setting.layoutOption) {
      const entityName = toEntityName(this.setting.element.name)
      const entity = entitySetting[entityName]
      assert('draw' in entity, `${entityName} must have DrawComponent`)
      const spriteName = toSpriteName(entity.draw.name)
      const { width, height } = getTexture(spriteName)
      const {
        center: [cx, cy],
        size: [sx, sy],
      } = this.setting.layoutOption
      // totalSize = elementSize * maxCount + margin * (maxCount + 1)
      // margin = (totalSize - elementSize * maxCount) / (maxCount + 1)
      const mx = (sx - width * tx) / (tx + 1)
      const my = (sy - height * ty) / (ty + 1)
      return [
        Math.floor(cx - sx / 2 + mx + (mx + width) * ix + width / 2),
        Math.floor(cy - sy / 2 + my + (my + height) * iy + height / 2),
      ]
    } else {
      const {
        offset: [ox, oy],
        shift: [sx, sy],
      } = this.setting.layoutOption
      return [ox + ix * sx, oy + iy * sy]
    }
  }

  private add(): void {
    const index = this.elements.length
    const element = loadEntityUi({
      ...this.setting.element,
    })
    element.addComponent('Position', new PositionComponent(...this.calcPos(index)))
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

  get count(): number {
    return this.elements.length
  }

  set count(count: number) {
    assert(count <= this.maxCount, '')
    while (this.count < count) {
      this.add()
    }
    while (count < this.count) {
      this.remove()
    }
  }

  get entities(): Array<Entity> {
    return this.elements
  }
}
