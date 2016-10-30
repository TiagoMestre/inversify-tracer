
import 'reflect-metadata';
import { interfaces, Kernel, injectable, inject } from 'inversify';

import { inversifyWatcher } from './index';


interface Person {
    isAlive(): boolean;
}

@injectable()
class Warrior implements Person {

    public weapon: Weapon;

    constructor(@inject('Weapon') weapon: Weapon) {
        this.weapon = weapon;
    }

    public attack() {
        console.log('swing weapon warrior');
    }

    public isAlive() {
        return true;
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

    public attack() {
        console.log('swing weapon ninja');
    }

    public isAlive() {
        return true;
    }
}

let kernel = new Kernel();

kernel.bind<Warrior>('Warrior').to(Ninja);
kernel.bind<Weapon>('Weapon').to(Katana);

const watcher = inversifyWatcher();

watcher.on('call', (className: string, methodName: string, args: any[]) => {
    console.log(`${className}:${methodName}:call ${args}`);
});

watcher.on('return', (className: string, methodName: string, result: any) => {
    console.log(`${className}:${methodName}:return ${result}`);
});

kernel.applyMiddleware(watcher.build());

let ninja = kernel.get<Warrior>('Warrior');

ninja.attack();
