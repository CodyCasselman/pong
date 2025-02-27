export class Ball {
  private _x: number;
  private _y: number;
  private _velocityX: number;
  private _velocityY: number;
  private _speed: number;
  private _color: string;
  private _radius: number;

  constructor(
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    speed: number,
    color: string
  ) {
    this._x = x;
    this._y = y;
    this._velocityX = velocityX;
    this._velocityY = velocityY;
    this._speed = speed;
    this._color = color;
    this._radius = 10; //MAGIC NUMBER
  }

  // Getters and setters
  get velocityX(): number {
    return this._velocityX;
  }

  set velocityX(value: number) {
    this._velocityX = value;
  }

  get velocityY(): number {
    return this._velocityY;
  }

  set velocityY(value: number) {
    this._velocityY = value;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  get speed(): number {
    return this._speed;
  }

  set speed(value: number) {
    this._speed = value;
  }

  get radius(): number {
    return this._radius;
  }

  set radius(value: number) {
    this._radius = value;
  }
}
