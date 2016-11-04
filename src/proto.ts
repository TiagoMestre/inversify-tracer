
import 'reflect-metadata';
import { interfaces, Kernel, injectable, inject } from 'inversify';
import * as minimatch from 'minimatch';
import { normalizeFilters, ClassFilter, MethodFilter } from './filters';
import { InversifyWatcher, CallInfo, ReturnInfo } from './index';

interface Warrior {
    attack(value: number, otherValue: string): number;
}

interface Weapon {
    use(force: number): number;
}

@injectable()
class Katana implements Weapon {

    public damage: number = 200;

    public use(force: number): number {
        return force * this.damage;
    }
}

@injectable()
class Ninja implements Warrior {

    public speed: number = 10;

    private weapon: Weapon;

    constructor(@inject('Weapon') weapon: Weapon) {
        this.weapon = weapon;
    }

    public attack(value: number, otherValue: string) {
        return this.weapon.use(value);
    }
}

let kernel = new Kernel();

kernel.bind<Warrior>('Warrior').to(Ninja);
kernel.bind<Ninja>('Ninja').to(Ninja);
kernel.bind<Weapon>('Weapon').to(Katana);

const watcher = new InversifyWatcher({
    filters: ['Ninja:*', '!Ninja:attack']
});

watcher.on('call', (callInfo: CallInfo) => {
    let comb = callInfo.parameters.map((param: any, i: number) => { return `${param}: ${callInfo.arguments[i]}`; });
    console.log(`${new Date().toISOString()} ${callInfo.className} ${callInfo.methodName} called ${comb}`);
});

watcher.on('return', (returnInfo: ReturnInfo) => {
    console.log(`${new Date().toISOString()} ${returnInfo.className} ${returnInfo.methodName} returned ${returnInfo.result}`);
});

kernel.applyMiddleware(watcher.build());

let warrior = kernel.get<Warrior>('Warrior');

warrior.attack(Math.floor(Math.random() * 10), 'asd');

let ninja = kernel.get<Ninja>('Ninja');

/*
let a = {
    m: function() {
        
    }
};

var mTemp = a.m;

a.m = function() {
    if (a.m.caller === null)
            console.log('I was called from the global scope.');
        else
            console.log((a.m.caller as any).id + ' called me!'); 

    mTemp.apply(a, arguments);
}

let d = function() {
    a.m();
};

let b = {
    m: d
};

(d as any).id = b;

b.m();

*/