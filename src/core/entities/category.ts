export enum Category {
  DEFAULT,
  WALL,
  PLAYER,
  ENEMY,
}

export class CategorySet extends Set<Category> {
  public static readonly MOVERS = new CategorySet([
    Category.PLAYER,
    Category.ENEMY,
  ])
  public static readonly ALL = new CategorySet([
    Category.DEFAULT,
    Category.WALL,
    Category.PLAYER,
    Category.ENEMY,
  ])

  public constructor(itr: Iterable<Category>)
  public constructor(category: Category)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(a: any) {
    if (Symbol.iterator in Object(a)) {
      super(a as Iterable<Category>)
    } else {
      super([a as Category])
    }
  }

  public negate(category: Category): CategorySet {
    const categorySet = new CategorySet(this)
    categorySet.delete(category)
    return categorySet
  }

  public negateSet(categories: CategorySet): CategorySet {
    const categorySet = new CategorySet(this)
    categories.forEach(x => categorySet.delete(x))
    return categorySet
  }
}
