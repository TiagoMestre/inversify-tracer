"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
require('reflect-metadata');
const inversify_1 = require('inversify');
const index_1 = require('./index');
let Warrior = class Warrior {
    constructor(weapon) {
        this.weapon = weapon;
    }
    attack() {
        console.log('swing weapon warrior');
    }
    isAlive() {
        return true;
    }
};
Warrior = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('Weapon')), 
    __metadata('design:paramtypes', [Object])
], Warrior);
let Katana = class Katana {
    constructor() {
        this.damage = 200;
    }
};
Katana = __decorate([
    inversify_1.injectable(), 
    __metadata('design:paramtypes', [])
], Katana);
let Ninja = class Ninja extends Warrior {
    constructor(weapon) {
        super(weapon);
        this.speed = 10;
    }
    attack() {
        console.log('swing weapon ninja');
    }
    isAlive() {
        return true;
    }
};
Ninja = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('Weapon')), 
    __metadata('design:paramtypes', [Object])
], Ninja);
let kernel = new inversify_1.Kernel();
kernel.bind('Warrior').to(Ninja);
kernel.bind('Weapon').to(Katana);
const watcher = index_1.inversifyWatcher();
watcher.on('call', (className, methodName, args) => {
    console.log(`${className}:${methodName}:call ${args}`);
});
watcher.on('return', (className, methodName, result) => {
    console.log(`${className}:${methodName}:return ${result}`);
});
kernel.applyMiddleware(watcher.build());
let ninja = kernel.get('Warrior');
ninja.attack();
//# sourceMappingURL=proto.js.map