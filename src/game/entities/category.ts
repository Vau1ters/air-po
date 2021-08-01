function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key
    return res
  }, Object.create(null))
}

export const CategoryDef = strEnum([
  /*
  AIR category is used for
    - being collected by AIR_HOLDER
    - being detected by some sensors
  Process above is done in AirHolderSystem and others
  */
  'air',
  /*
  AIR_HOLDER category is used for
    - collecting airs
  Process above is done in AirHolderSystem
  Collider with AIR_HOLDER category must have
    - 'AIR_HOLDER_TAG' tag
    - 'AIR' mask
  */
  'airHolder',
  /*
  BULLET category is used for
    - remove entity from world when contacting a collider with PHYSICS category
  Process above is done in BulletSystem
  Collider with BULLET category must have
    - 'BULLET_TAG' tag
    - 'TERRAIN' mask
  */
  'bullet',
  /*
  PHYSICS category is used for
    - updating velocity and position
    - solve contact
  Process above is done in PhysicsSystem
  Collider with PHYSICS category must have
    - 'PHYSICS_TAG' tag
    - 'PHYSICS' or 'TERRAIN' mask
  */
  'physics',
  /*
  TERRAIN category is used for
    - solve contact
  Process above is done in PhysicsSystem
  Collider with TERRAIN category must have
    - 'PHYSICS_TAG' tag
    - 'PHYSICS' mask
  */
  'terrain',
  /*
  ATTACK category is used for
    - sending damage
  Process above is done in DamageSystem
  Collider with ATTACK category must have
    - 'ATTACK_TAG' tag
    - 'HITBOX' mask
  */
  'attack',
  /*
  PLAYER_HITBOX and ENEMY_HITBOX category is used for
    - receiving damage
  Process above is done in DamageSystem
  */
  'playerHitbox',
  'enemyHitbox',
  /*
  ITEM category is used for
    - being detected by player as item
  */
  'item',
  /*
  EQUIPMENT category is used for
    - being detected by player as quipment
  Process above is done in EventSensorSystem
  */
  'equipment',
  /*
  SENSOR category is used for
    - being detected by player as sensor
  Process above is done in EventSensorSystem
  */
  'sensor',
  /*
  LIGHT category is used for
    - increasing intensity when contacting AIR
  Process above is done in LightSystem
  Collider with LIGHT category must have
    - 'LIGHT_TAG' tag
    - 'AIR' mask
  */
  'light',
  'draw',
])

export type Category = keyof typeof CategoryDef
const AllCategory = Object.keys(CategoryDef) as Category[]

export class CategorySet extends Set<Category> {
  public static readonly ALL = new CategorySet(...AllCategory)

  public static readonly NONE = new CategorySet()

  public constructor(...categories: Category[]) {
    super([...categories])
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
