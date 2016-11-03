
import 'reflect-metadata';
import { interfaces, Kernel, injectable, inject } from 'inversify';
import * as minimatch from 'minimatch';
import { normalizeFilters, ClassFilter, MethodFilter } from './filters';
import { InversifyWatcher, CallInfo, ReturnInfo } from './index';

@injectable()
class Warrior {

    public weapon: Weapon;

    constructor(@inject('Weapon') weapon: Weapon) {
        this.weapon = weapon;
    }

    public attack(value: number, otherValue: string) {
    }
}

interface Weapon {}

@injectable()
class Katana implements Weapon {
    public damage: number = 200;
}

@injectable()
class Ninja extends Warrior {

    public speed: number = 10;

    constructor(@inject('Weapon') weapon: Weapon) {
        super(weapon);
    }

    public attack(value: number, otherValue: string) {
        return value;
    }

    public attackPromise() {
        return Promise.resolve('promise value');
    }
}

@injectable()
class Samurai extends Warrior {

    public speed: number = 4;

    constructor(@inject('Weapon') weapon: Weapon) {
        super(weapon);
    }

    public attack(value: number, otherValue?: string) {
        return value;
    }
}

let kernel = new Kernel();

kernel.bind<Warrior>('Warrior').to(Ninja);
kernel.bind<Warrior>('Warrior').to(Samurai);
kernel.bind<Ninja>('Ninja').to(Ninja);
kernel.bind<Weapon>('Weapon').to(Katana);

const watcher = new InversifyWatcher({
    filters: ['Ninja:*', '!Ninja:attack']
});

watcher.on('call', (callInfo: CallInfo) => {
    let comb = callInfo.parameters.map((param: any, i: number) => { return `${param}: ${callInfo.arguments[i]}`; });
    console.log(`${new Date().toISOString()} ${callInfo.objectId} ${callInfo.className} ${callInfo.methodName} called ${comb}`);
});

watcher.on('return', (returnInfo: ReturnInfo) => {
    // console.log(`${new Date().toISOString()} ${returnInfo.objectId} 
    // ${returnInfo.className} ${returnInfo.methodName} returned ${returnInfo.result}`);
});

kernel.applyMiddleware(watcher.build());

let warriors = kernel.getAll<Warrior>('Warrior');

warriors.forEach((warrior) => {
    warrior.attack(Math.floor(Math.random() * 10), 'asd');
});

let ninja = kernel.get<Ninja>('Ninja');

ninja.attackPromise().then((value) => {
    console.log(value);
});