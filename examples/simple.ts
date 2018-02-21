import 'reflect-metadata';
import { decorate, injectable, inject, Container } from 'inversify';
import { InversifyTracer, CallInfo, ReturnInfo } from './../src';

interface Warrior {
    attack(): number;
}

interface Weapon {
    use(force: number): number;
}

class Katana implements Weapon {

    public damage: number = 200;

    public use(force: number): number {
        return force * this.damage;
    }
}

// tslint:disable-next-line:max-classes-per-file
class Ninja implements Warrior {

    private weapon: Weapon;

    public constructor(weapon: Weapon) {
        this.weapon = weapon;
    }

    public attack() {
        return this.weapon.use(2);
    }
}

decorate(injectable(), Katana);

decorate(injectable(), Ninja);
decorate(inject('Weapon'), Katana, 0);

const container = new Container();

container.bind<Weapon>('Weapon').toConstantValue(new Katana());
container.bind<Warrior>('Warrior').to(Ninja);

const tracer = new InversifyTracer();

tracer.on('call', (callInfo: CallInfo) => {
    const parametersWithValue = callInfo.parameters.map((param: any, i: number) => `${param}:${callInfo.arguments[i]}`);
    console.log(`${callInfo.className} ${callInfo.methodName} called ${parametersWithValue}`);
});

tracer.on('return', (returnInfo: ReturnInfo) => {
    console.log(`${returnInfo.className} ${returnInfo.methodName} returned ${returnInfo.result}`);
});

tracer.apply(container);

const warrior = container.get<Warrior>('Warrior');

warrior.attack();
