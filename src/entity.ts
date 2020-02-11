import * as PIXI from 'pixi.js'

export default class Entity {
  private x = 0
  constructor() {
    const g = new PIXI.Graphics()
    g.beginFill(0xff0000)
    g.drawRect(10, 10, 780, 580)
    g.endFill()
    //app.stage.addChild(g)
  }
  update(): void {
    this.x++
    console.log('update:', this.x)
  }
}
