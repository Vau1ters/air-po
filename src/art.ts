import * as PIXI from 'pixi.js'

export default class Art {
  public static load(
    loader: PIXI.Loader,
    resources: Partial<Record<string, PIXI.LoaderResource>>
  ): void {
    console.log(loader)
    console.log(resources.testShader)
  }

  public static init(): Promise<void> {
    return new Promise(resolve => {
      const loader = new PIXI.Loader()
      loader
        .add('testShader', 'src/resource/test.frag')
        .load((loader, resources) => Art.load(loader, resources))
        .onComplete.add(resolve)
    })
  }
  public static createRect(color: number): PIXI.Graphics {
    const sprite = new PIXI.Graphics()
    sprite.beginFill(color)
    sprite.drawRect(0, 0, 32, 32)
    sprite.endFill()
    return sprite
  }
}
