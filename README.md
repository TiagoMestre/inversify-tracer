# inversify-tracer

[![npm version](https://badge.fury.io/js/inversify-tracer.svg)](https://badge.fury.io/js/inversify-tracer)
[![Build Status](https://travis-ci.org/tiagomestre/inversify-tracer.svg)](https://travis-ci.org/tiagomestre/inversify-tracer)
[![Coverage Status](https://coveralls.io/repos/github/tiagomestre/inversify-tracer/badge.svg)](https://coveralls.io/github/tiagomestre/inversify-tracer)
[![dependencies Status](https://david-dm.org/tiagomestre/inversify-tracer/status.svg)](https://david-dm.org/tiagomestre/inversify-tracer)
[![devDependencies Status](https://david-dm.org/tiagomestre/inversify-tracer/dev-status.svg)](https://david-dm.org/tiagomestre/inversify-tracer?type=dev)

Tool that allows the developer to trace methods of objects created by [InversifyJS](https://github.com/inversify/InversifyJS).

## Installation

You can get the latest release and the type definitions using npm:

```
$ npm install --save inversify-tracer
```

## Example
```ts
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
```

**Result:**

```
Ninja attack called with [{"name":"force","value":2}]
Ninja attack returned 64 - 0ms
Ninja slowAttack called with [{"name":"force","value":4},{"name":"time","value":1000}]
Ninja attack called with [{"name":"force","value":4}]
Ninja attack returned 128 - 0ms
Ninja slowAttack returned 128 - 1004ms
```

## Configuration

The configuration allows you to change the default behavior of the tracer. This configuration is passed through the InversifyTracer constructor. Example:

```ts
const tracer = new InversifyTracer({
    filters: ["*:*", "!Ninja:*"],
    inspectReturnedPromise: false
});

tracer.apply(container);
```

| Property              | Type      | Default       | Description                                                   |
|---                    |---        |---            |---                                                            |
| filters               | string[]  | \['\*:\*'\]   | Filters that choose which classes and method will be traced   |
| inspectReturnedPromise| boolean   | true          | Inpect the value from the returned Promise object             |


### Filters

Filters allow you to specify the classes and/or functions you want to trace. By default, all classes and methods will be traced.

**Filter examples**:

```ts
['*:*', '!Ninja:*'] // trace every class, except Ninja
['Ninja:*', '!Ninja:hide'] // trace every method of the class Ninja, except the 'hide' method
['*:attack'] // trace attack method from every class
['Nin*:*'] // trace every method of the classes that start with 'Nin'
```

## Events
### Event: 'call'

+ callInfo \<CallInfo\>

Emitted each time a class method is called.

### CallInfo

| Property      | Type         | Description                                       |
|---            |---           |---                                                |
| className     | string       | Name of the class                                 |
| methodName    | string       | Name of the method                                |
| parameters    | Parameter[]  | Array with the name of the method's parameters and their value |

### Event: 'return'

+ returnInfo \<ReturnInfo\>

Emitted each time a class method ends.

### ReturnInfo

| Property      | Type      | Description                           |
|---            |---        |---                                    |
| className     | string    | Name of the class                     |
| methodName    | string    | Name of the method                    |
| result        | any       | Returned value of the method          |
| executionTime | number    | Method execution time in milliseconds |
