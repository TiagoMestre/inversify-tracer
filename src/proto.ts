
import 'reflect-metadata';
import { interfaces, Kernel, injectable, inject } from 'inversify';

import { inversifyWatcher, CallInfo, ReturnInfo } from './index';

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
}

@injectable()
class Samurai extends Warrior {

    public speed: number = 4;

    constructor(@inject('Weapon') weapon: Weapon) {
        super(weapon);
    }

    public attack(value: number) {
        return value;
    }
}

let kernel = new Kernel();

kernel.bind<Warrior>('Warrior').to(Ninja);
kernel.bind<Warrior>('Warrior').to(Samurai);
kernel.bind<Ninja>('Ninja').to(Ninja);
kernel.bind<Weapon>('Weapon').to(Katana);

const watcher = inversifyWatcher({
    classes: []
});

watcher.on('call', (callInfo: CallInfo) => {
    let comb = callInfo.parameters.map((param: any, i: number) => { return `${param}: ${callInfo.arguments[i]}`; });
    console.log(`${new Date().toISOString()} ${callInfo.objectId} ${callInfo.className} ${callInfo.methodName} called ${comb}`);
});

watcher.on('returna', (className: string, methodName: string, result: any) => {
    console.log(`${new Date().toISOString()} ${className} ${methodName} return ${result}`);
});

kernel.applyMiddleware(watcher.build());

let warriors = kernel
    .getAll<Warrior>('Warrior')
    .concat(kernel.getAll<Warrior>('Warrior'))
    .concat(kernel.getAll<Warrior>('Warrior'));

warriors.forEach((warrior) => {
    warrior.attack(Math.floor(Math.random() * 10), 'asd');
});
