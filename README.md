# inversify-tracer

[![Build Status](https://travis-ci.org/TiagoMestre/inversify-tracer.svg?branch=dev)](https://travis-ci.org/TiagoMestre/inversify-tracer)
[![Coverage Status](https://coveralls.io/repos/github/TiagoMestre/inversify-tracer/badge.svg?branch=dev)](https://coveralls.io/github/TiagoMestre/inversify-tracer?branch=dev)

A console logger middleware for [InversifyJS](https://github.com/inversify/InversifyJS).


## Instalation

You can get the latest release and the type definitions using npm:

```
$ npm install inversify-tracer --save
$ npm install @types/inversify-tracer --save-dev
```

## Example
```ts

import { injectable } from 'inversify';
import { InversifyTracer } from 'inversify-tracer';

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

```

## Configuration



### Filters