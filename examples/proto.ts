'use strict';

import 'reflect-metadata';
import { interfaces, Kernel, injectable, inject } from 'inversify';
import { InversifyTracer, CallInfo, ReturnInfo } from './../src/index';

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

kernel.bind<Weapon>('Weapon').to(Katana);
kernel.bind<Warrior>('Warrior').to(Ninja);

const tracer = new InversifyTracer({
    filters: ['Katana:*']
});

tracer.on('call', (callInfo: CallInfo) => {
    let comb = callInfo.parameters.map((param: any, i: number) => { return `${param}: ${callInfo.arguments[i]}`; });
    console.log(`${new Date().toISOString()} ${callInfo.className} ${callInfo.methodName} called ${comb}`);
});

tracer.on('return', (returnInfo: ReturnInfo) => {
    console.log(`${new Date().toISOString()} ${returnInfo.className} ${returnInfo.methodName} returned ${returnInfo.result}`);
});

tracer.apply(kernel);

let warrior = kernel.get<Warrior>('Warrior');

warrior.attack(Math.floor(Math.random() * 10), 'asd');