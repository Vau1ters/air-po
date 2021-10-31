import { Item } from './item'

export class TestItem extends Item {
  use(): void {
    console.log('used test item')
  }

  canUse(): boolean {
    return true
  }
}
