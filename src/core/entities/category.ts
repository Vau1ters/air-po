export enum Category {
  DEFAULT,
  WALL,
  PLAYER,
  ENEMY,
  AIR,
}

export class CategorySet extends Set<Category> {
  public static readonly MOVERS = new CategorySet(Category.PLAYER, Category.ENEMY)
  public static readonly ALL = new CategorySet(
    ...Object.entries(Category).map(t => t[1] as Category)
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

export const CategoryList = {
  bulletBody: {
    category: Category.PLAYER,
    mask: new CategorySet(Category.WALL),
  },
  bulletAttack: {
    category: Category.DEFAULT,
    mask: CategorySet.ALL,
  },
  enemy1Body: {
    category: Category.ENEMY,
    mask: CategorySet.ALL.negateSet(CategorySet.MOVERS),
  },
  enemy1Attack: {
    category: Category.DEFAULT,
    mask: CategorySet.ALL,
  },
  playerBody: {
    category: Category.PLAYER,
    mask: CategorySet.ALL.negateSet(CategorySet.MOVERS),
  },
  playerFoot: {
    category: Category.PLAYER,
    mask: CategorySet.ALL.negateSet(CategorySet.MOVERS),
  },
  wall: {
    category: Category.WALL,
    mask: CategorySet.ALL.negate(Category.WALL),
  },
}
