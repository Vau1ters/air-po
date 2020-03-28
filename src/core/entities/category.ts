export enum Category {
  DUMMY,
  WALL,
  PLAYER,
  ENEMY,
}

export class CategorySet {
  public static readonly MOVERS = new Set([Category.PLAYER, Category.ENEMY])
  public static readonly ALL = new Set([
    Category.DUMMY,
    Category.WALL,
    Category.PLAYER,
    Category.ENEMY,
  ])
}
