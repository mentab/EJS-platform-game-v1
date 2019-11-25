import { Vec } from './../models/vec.js';
import { State } from './../models/state.js';

export class Wall {
  constructor(pos, speed) {
  	this.pos = pos;
  	this.speed = speed;
  }
  
  get type() { return "wall"; }
  
  static create(pos) {
  	return new Wall(pos.plus(new Vec(1.5, 0)), new Vec(2, 0));
  }
}

Wall.prototype.size = new Vec(3, 1);

Wall.prototype.update = function(time, state) {
	let newPos = this.pos.plus(this.speed.times(time));
    if (!state.level.touches(newPos, this.size, "wall")) {
      return new Wall(newPos, this.speed);
    } else {
      return new Wall(this.pos, this.speed.times(-1));
    }
}
  
Wall.prototype.collide = function(state) {
	return new State(state.level, state.actors, state.status);
}