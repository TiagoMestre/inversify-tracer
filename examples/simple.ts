import 'reflect-metadata';
import { decorate, injectable, Container } from 'inversify';
import { InversifyTracer, CallInfo, ReturnInfo } from './../src';

class Ninja  {

    public attack(force: number) {
        return 32 * force;
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
    console.log(`${returnInfo.className} ${returnInfo.methodName} returned ${returnInfo.result}`);
});

tracer.apply(container);

const warrior = container.get<Ninja>('Ninja');

warrior.attack(2);
