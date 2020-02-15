export class PositionComponent {
  public constructor(public x = 0, public y = 0) {}
}

export class VelocityComponent {
  public constructor(public x = 0, public y = 0) {}
}

export interface ComponentFactory {
  Position: PositionComponent
  Velocity: VelocityComponent
}

export type ComponentName = keyof ComponentFactory
