import 'reflect-metadata';
import { decorate, injectable, Container } from 'inversify';
import { InversifyTracer, CallInfo, ReturnInfo } from './../src';

class Ninja  {

    public attack(force: number): number {
        return 32 * force;
    }

    public slowAttack(force: number, time: number): Promise<number> {

        return new Promise((resolve) => {

            setTimeout(() => {
                resolve(this.attack(force));
            }, time);
        });
    }
}

decorate(injectable(), Ninja);

const container = new Container();

container.bind<Ninja>('Ninja').to(Ninja);

const tracer = new InversifyTracer();

tracer.on('call', (callInfo: CallInfo) => {
    console.log(`${callInfo.className} ${callInfo.methodName} called with ${JSON.stringify(callInfo.parameters)}`);
});

tracer.on('return', (returnInfo: ReturnInfo) => {
    console.log(`${returnInfo.className} ${returnInfo.methodName} returned ${returnInfo.result} - ${returnInfo.executionTime}ms`);
});

tracer.apply(container);

const ninja = container.get<Ninja>('Ninja');

ninja.attack(2);
ninja.slowAttack(4, 1000);