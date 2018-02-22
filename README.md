# inversify-tracer

[![npm version](https://badge.fury.io/js/inversify-tracer.svg)](https://badge.fury.io/js/inversify-tracer)
[![Build Status](https://travis-ci.org/tiagomestre/inversify-tracer.svg?branch=upgrade-project)](https://travis-ci.org/tiagomestre/inversify-tracer)
[![Coverage Status](https://coveralls.io/repos/github/tiagomestre/inversify-tracer/badge.svg?branch=upgrade-project)](https://coveralls.io/github/tiagomestre/inversify-tracer?branch=upgrade-project)

Tool that allows the developer to trace methods of objects created by [InversifyJS](https://github.com/inversify/InversifyJS).

## Installation

You can get the latest release and the type definitions using npm:

```
$ npm install inversify-tracer --save
```

## Example
```ts
import 'reflect-metadata';
import { decorate, injectable, inject, Container } from 'inversify';
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
    const parametersWithValue = callInfo.parameters.map((param: any, i: number) => `${param}:${callInfo.arguments[i]}`);
    console.log(`${callInfo.className} ${callInfo.methodName} called ${parametersWithValue}`);
});

tracer.on('return', (returnInfo: ReturnInfo) => {
    console.log(`${returnInfo.className} ${returnInfo.methodName} returned ${returnInfo.result}`);
});

tracer.apply(container);

const warrior = container.get<Ninja>('Ninja');

warrior.attack(2);
```

**Result:**

```
Ninja attack called force:2
Ninja attack returned 64
```

## Configuration

The configuration allows you to change the default behavior of the tracer. This configuration is passed through the InversifyTracer constructor. Example:

```ts
const tracer = new InversifyTracer({
    filters: ["*:*", "!Ninja:*"],
    inspectReturnedPromise: false
});

tracer.apply(kernel);
```

| Property              | Type      | Default       | Description                                                   |
|---                    |---        |---            |---                                                            |
| filters               | string[]  | \['\*:\*'\]   | Filters that choose which classes and method will be traced   |
| inspectReturnedPromise| boolean   | true          | Inpect the value from the returned Promise object             |


### Filters

Filters allow you to specify the classes and/or functions you want to trace. By default, all classes and methods will be traced.

**Filter examples**:

```ts
['*:*', '!Ninja:*'] // trace every class, expect Ninja
['Ninja:*', '!Ninja:hide'] // trace every method of the class Ninja, expect the 'hide' method
['*:attack'] // trace attack method from every class
['Nin*:*'] // trace every method of the classes that start with 'Nin'
```

## Events
### Event: 'call'

+ callInfo \<CallInfo\>

Emitted each time a class method is called.

### CallInfo

| Property      | Type      | Description                                       |
|---            |---        |---                                                |
| className     | string    | Name of the class                                 |
| methodName    | string    | Name of the method                                |
| parameters    | string[]  | Array with the name of the method's parameters    |
| arguments     | any[]     | Array of values passed to the method              |

### Event: 'return'

+ returnInfo \<ReturnInfo\>

Emitted each time a class method ends.

### ReturnInfo

| Property      | Type      | Description                   |
|---            |---        |---                            |
| className     | string    | Name of the class             |
| methodName    | string    | Name of the method            |
| result        | any       | Returned value of the method  |
