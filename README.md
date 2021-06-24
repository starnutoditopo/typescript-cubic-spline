# typescript-cubic-spline

A cubic spline guesses the value of y for any x value on a curve. This is helpful, for example, for smoothing line graphs.

This project is a typescript implementation of [Morgan Herlocker's cubic-spline](https://github.com/morganherlocker/cubic-spline), which, in turn, is a slight modification of [Ivan Kuckir's cubic spline implementation](http://blog.ivank.net/interpolation-with-cubic-splines.html).

## installation

Using *yarn*:

```sh
yarn add typescript-cubic-spline
```

or using *npm*:

```sh
npm install typescript-cubic-spline
```

## usage

```ts
import Spline from 'typescript-cubic-spline';

const xs = [1, 2, 3, 4, 5];
const ys = [9, 3, 6, 2, 4];

// new a Spline object
const spline = new Spline(xs, ys);

// get Y at arbitrary X
console.log(spline.at(1.4));

// interpolate a line at a higher resolution
for (let i = 0; i < 50; i++) {
  console.log(spline.at(i * 0.1));
}
```

## test

```sh
yarn test
```

or:

```sh
npm test
```

## lint

```sh
yarn lint
```

```sh
npm run lint
```
