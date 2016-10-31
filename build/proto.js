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
    attack(value, otherValue) {
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
    attack(value, otherValue) {
        return value;
    }
};
Ninja = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('Weapon')), 
    __metadata('design:paramtypes', [Object])
], Ninja);
let Samurai = class Samurai extends Warrior {
    constructor(weapon) {
        super(weapon);
        this.speed = 4;
    }
    attack(value) {
        return value;
    }
};
Samurai = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('Weapon')), 
    __metadata('design:paramtypes', [Object])
], Samurai);
let kernel = new inversify_1.Kernel();
kernel.bind('Warrior').to(Ninja);
kernel.bind('Warrior').to(Samurai);
kernel.bind('Ninja').to(Ninja);
kernel.bind('Weapon').to(Katana);
const watcher = index_1.inversifyWatcher({
    classes: []
});
watcher.on('call', (callInfo) => {
    let comb = callInfo.parameters.map((param, i) => { return `${param}: ${callInfo.arguments[i]}`; });
    console.log(`${new Date().toISOString()} ${callInfo.objectId} ${callInfo.className} ${callInfo.methodName} called ${comb}`);
});
watcher.on('returna', (className, methodName, result) => {
    console.log(`${new Date().toISOString()} ${className} ${methodName} return ${result}`);
});
kernel.applyMiddleware(watcher.build());
let warriors = kernel
    .getAll('Warrior')
    .concat(kernel.getAll('Warrior'))
    .concat(kernel.getAll('Warrior'));
warriors.forEach((warrior) => {
    warrior.attack(Math.floor(Math.random() * 10), 'asd');
});
//# sourceMappingURL=proto.js.map