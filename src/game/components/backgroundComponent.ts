import { Vec2 } from '@core/math/vec2'

export class BackgroundComponent {
  public constructor(public readonly scrollSpeed: Vec2, public readonly horizontalY: number) {}
}
