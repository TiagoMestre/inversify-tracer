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
let Katana = class Katana {
    constructor() {
        this.damage = 200;
    }
    use(force) {
        return force * this.damage;
    }
};
Katana = __decorate([
    inversify_1.injectable(), 
    __metadata('design:paramtypes', [])
], Katana);
let Ninja = class Ninja {
    constructor(weapon) {
        this.speed = 10;
        this.weapon = weapon;
    }
    attack(value, otherValue) {
        return this.weapon.use(value);
        ;
    }
};
Ninja = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject('Weapon')), 
    __metadata('design:paramtypes', [Object])
], Ninja);
let kernel = new inversify_1.Kernel();
kernel.bind('Warrior').to(Ninja);
kernel.bind('Ninja').to(Ninja);
kernel.bind('Weapon').to(Katana);
const watcher = new index_1.InversifyWatcher({
    filters: ['Ninja:*', '!Ninja:attack']
});
watcher.on('call', (callInfo) => {
    let comb = callInfo.parameters.map((param, i) => { return `${param}: ${callInfo.arguments[i]}`; });
    console.log(`${new Date().toISOString()} ${callInfo.className} ${callInfo.methodName} called ${comb}`);
});
watcher.on('return', (returnInfo) => {
    console.log(`${new Date().toISOString()} ${returnInfo.className} ${returnInfo.methodName} returned ${returnInfo.result}`);
});
kernel.applyMiddleware(watcher.build());
let warrior = kernel.get('Warrior');
warrior.attack(Math.floor(Math.random() * 10), 'asd');
let ninja = kernel.get('Ninja');
//# sourceMappingURL=proto.js.map