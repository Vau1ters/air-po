export enum Category {
  DUMMY = 0x0001,
  WALL = 0x0002,
  PLAYER = 0x0004,
  ENEMY = 0x0008,
  MOVERS = PLAYER | ENEMY,
  ALL = 0xffff,
}
