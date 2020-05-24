export enum Category {
  DEFAULT,
  WALL,
  PLAYER,
  ENEMY,
  AIR,
}

export class CategorySet extends Set<Category> {
  public static readonly MOVERS = new CategorySet(
    Category.PLAYER,
    Category.ENEMY
  )
  public static readonly ALL = new CategorySet(
    Category.DEFAULT,
    Category.WALL,
    Category.PLAYER,
    Category.ENEMY,
    Category.AIR
  )

  public constructor(...categories: Category[]) {
    super(categories)
  }

  public clone(): CategorySet {
    const set = new CategorySet()
    for (const category of this) {
      set.add(category)
    }
    return set
  }

  public negate(category: Category): CategorySet {
    const categorySet = this.clone()
    categorySet.delete(category)
    return categorySet
  }

  public negateSet(categories: CategorySet): CategorySet {
    const categorySet = this.clone()
    categories.forEach(x => categorySet.delete(x))
    return categorySet
  }
}
