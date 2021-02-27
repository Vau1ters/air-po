export enum Category {
  STATIC_WALL,
  DYNAMIC_WALL,
  PHYSICS,
  PLAYER_HITBOX,
  ATTACK,
  HITBOX,
  ITEM,
  AIR,
  SENSOR,
  LIGHT,
  DRAW,
}

export class CategorySet extends Set<Category> {
  public static readonly ALL = new CategorySet(
    ...Object.entries(Category)
      .filter(t => typeof t[1] === 'number')
      .map(t => t[1] as Category)
  )

  public static readonly NONE = new CategorySet()

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
