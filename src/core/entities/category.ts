export enum Category {
  DEFAULT,
  WALL,
  PLAYER,
  ENEMY,
  PLAYER_ATTACK,
  ENEMY_ATTACK,
  BULLET,
  BALLOON_VINE,
  AIR,
  VINE,
}

export class CategorySet extends Set<Category> {
  public static readonly MOVERS = new CategorySet(Category.PLAYER, Category.ENEMY)
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

export const CategoryList = {
  bulletBody: {
    category: Category.BULLET,
    mask: new CategorySet(Category.WALL),
  },
  enemyBody: {
    category: Category.ENEMY,
    mask: CategorySet.ALL.negateSet(CategorySet.MOVERS),
  },
  enemyAttack: {
    category: Category.ENEMY_ATTACK,
    mask: new CategorySet(Category.PLAYER, Category.BALLOON_VINE),
  },
  playerBody: {
    category: Category.PLAYER,
    mask: CategorySet.ALL.negateSet(CategorySet.MOVERS),
  },
  playerFoot: {
    category: Category.PLAYER,
    mask: CategorySet.ALL.negateSet(CategorySet.MOVERS),
  },
  playerAttack: {
    category: Category.PLAYER_ATTACK,
    mask: new CategorySet(Category.ENEMY, Category.BALLOON_VINE),
  },
  balloonVine: {
    category: Category.BALLOON_VINE,
    mask: new CategorySet(Category.AIR, Category.ENEMY_ATTACK, Category.PLAYER_ATTACK),
  },
  wall: {
    category: Category.WALL,
    mask: CategorySet.ALL.negate(Category.WALL),
  },
  vine: {
    category: Category.VINE,
    mask: CategorySet.ALL.negate(Category.VINE),
  },
  air: {
    category: Category.AIR,
    mask: CategorySet.ALL.negate(Category.WALL),
  },
}
