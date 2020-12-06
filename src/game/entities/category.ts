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

export const CategoryList = {
  balloonVine: {
    grip: {
      category: Category.ITEM,
      mask: new CategorySet(Category.SENSOR),
    },
    body: {
      category: Category.HITBOX,
      mask: new CategorySet(Category.ATTACK),
    },
    root: {
      category: Category.PHYSICS,
      mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL, Category.PHYSICS),
    },
    wallSensor: {
      category: Category.SENSOR,
      mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL),
    },
    airSensor: {
      category: Category.SENSOR,
      mask: new CategorySet(Category.AIR),
    },
  },
  bulletBody: {
    category: Category.PHYSICS,
    mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL),
  },
  dandelionFluff: {
    category: Category.ITEM,
    mask: new CategorySet(Category.SENSOR),
  },
  enemy: {
    body: {
      category: Category.PHYSICS,
      mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL),
    },
    hitBox: {
      category: Category.HITBOX,
      mask: new CategorySet(Category.ATTACK),
    },
    attack: {
      category: Category.ATTACK,
      mask: new CategorySet(Category.PLAYER_HITBOX),
    },
  },
  moss: {
    light: {
      category: Category.LIGHT,
      mask: new CategorySet(Category.SENSOR),
    },
    airSensor: {
      category: Category.SENSOR,
      mask: new CategorySet(Category.AIR),
    },
  },
  airGeyser: {
    category: Category.DYNAMIC_WALL,
    mask: new CategorySet(Category.PHYSICS),
  },
  player: {
    body: {
      category: Category.PHYSICS,
      mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL),
    },
    hitBox: {
      category: Category.PLAYER_HITBOX,
      mask: new CategorySet(Category.ATTACK, Category.SENSOR),
    },
    sensor: {
      category: Category.SENSOR,
      mask: new CategorySet(Category.ITEM, Category.AIR, Category.SENSOR),
    },
    foot: {
      category: Category.PHYSICS,
      mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL),
    },
    attack: {
      category: Category.ATTACK,
      mask: new CategorySet(Category.HITBOX),
    },
  },
  vine: {
    body: {
      category: Category.DYNAMIC_WALL,
      mask: new CategorySet(Category.PHYSICS),
    },
    wallSensor: {
      category: Category.SENSOR,
      mask: new CategorySet(Category.STATIC_WALL, Category.DYNAMIC_WALL),
    },
    airSensor: {
      category: Category.SENSOR,
      mask: new CategorySet(Category.AIR),
    },
  },
  wall: {
    category: Category.STATIC_WALL,
    mask: new CategorySet(Category.SENSOR, Category.PHYSICS),
  },
  air: {
    category: Category.AIR,
    mask: new CategorySet(Category.SENSOR),
  },
  lightSearcher: {
    category: Category.SENSOR,
    mask: new CategorySet(Category.LIGHT),
  },
  eventSensor: {
    category: Category.SENSOR,
    mask: new CategorySet(Category.SENSOR),
  },
}
