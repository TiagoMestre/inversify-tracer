import 'reflect-metadata';
import { injectable, inject, Kernel } from 'inversify';
import { InversifyTracer, CallInfo, ReturnInfo } from './../src';

interface Warrior {
    attack(): number;
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

    private weapon: Weapon;

    constructor(@inject('Weapon') weapon: Weapon) {
        this.weapon = weapon;
    }

    public attack() {
        return this.weapon.use(2);
    }
}

const kernel = new Kernel();

kernel.bind<Weapon>('Weapon').toConstantValue(new Katana());
kernel.bind<Warrior>('Warrior').to(Ninja);

const tracer = new InversifyTracer();

tracer.on('call', (callInfo: CallInfo) => {
    const parametersWithValue = callInfo.parameters.map((param: any, i: number) => `${param}:${callInfo.arguments[i]}`);
    console.log(`${callInfo.className} ${callInfo.methodName} called ${parametersWithValue}`);
});

tracer.on('return', (returnInfo: ReturnInfo) => {
    console.log(`${returnInfo.className} ${returnInfo.methodName} returned ${returnInfo.result}`);
});

tracer.apply(kernel);

const warrior = kernel.get<Warrior>('Warrior');

warrior.attack();

