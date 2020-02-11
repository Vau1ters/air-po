import * as PIXI from 'pixi.js'

export default class Entity {
  constructor() {
    const g = new PIXI.Graphics()
    g.beginFill(0xff0000)
    g.drawRect(10, 10, 780, 580)
    g.endFill()
    //app.stage.addChild(g)
  }
}
