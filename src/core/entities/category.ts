export enum Category {
  DEFAULT,
  WALL,
  PLAYER,
  ENEMY,
}

export class CategorySet {
  public static readonly MOVERS = new Set([Category.PLAYER, Category.ENEMY])
  public static readonly ALL = new Set([
    Category.DEFAULT,
    Category.WALL,
    Category.PLAYER,
    Category.ENEMY,
  ])
}
