import Spline from "./Spline";
//const Spline = require('.');

describe("spline", function () {
  it("should return a correct value of type number", () => {
    const xs = [1, 2, 3, 4, 5];
    const ys = [9, 3, 6, 2, 4];

    // new a Spline object
    const spline = new Spline(xs, ys);

    // get Y at arbitrary X
    expect(spline.at(1.4)).toBe(5.586);

    // interpolate a line at a higher resolution
    for (var i = 0; i < 50; i++) {
      expect(spline.at(i * 0.1)).toEqual(expect.any(Number));
    }
  });
});

describe("spline edge cases", function () {
  it("arrays must be of same size", () => {
    const xs = [1, 2, 3, 4, 5];
    const ys = [9, 3, 6, 2];

    const shouldThrow = () => {
      new Spline(xs, ys);
    };

    expect(shouldThrow).toThrow("Input arrays must be of same size.");
  });

  it("empty input is not allowed", () => {
    const xs: number[] = [];
    const ys: number[] = [];

    const shouldThrow = () => {
      new Spline(xs, ys);
    };

    expect(shouldThrow).toThrow();
  });

  it("empty input is not allowed", () => {
    const xs = [1];
    const ys = [1];

    const spline = new Spline(xs, ys);
    console.log(spline.at(1));
  });

  it("arrays must be of same size", () => {
    const xs = [1, 2, 3, 4, 3.5];
    const ys = [9, 3, 6, 2, 5];

    const shouldThrow = () => {
      new Spline(xs, ys);
    };

    expect(shouldThrow).toThrow("xs must increase monotonically.");
  });

  it("array of size 1 works", () => {
    const xs = [4];
    const ys = [4];

    const spline = new Spline(xs, ys);
    expect(spline.at(1.4)).toBe(4);
    expect(spline.at(4)).toBe(4);
    expect(spline.at(8)).toBe(4);
  });

  it("linear interpolation when using lenght of 2", () => {
    const xs = [3, 4];
    const ys = [0, 10];

    const spline = new Spline(xs, ys);
    expect(spline.at(3.5)).toBe(5);
  });

  it("no errors when querying outside of bounds", () => {
    const xs = [3, 4, 5];
    const ys = [3, 4, 5];

    const spline = new Spline(xs, ys);
    expect(spline.at(3)).toBe(3);
    expect(spline.at(4)).toBe(4);

    expect(spline.at(1)).toBe(3);
    expect(spline.at(6)).toBe(5);

    // Check for https://github.com/starnutoditopo/typescript-cubic-spline/issues/2
    expect(spline.at(5.5)).toBe(5);
  });

  // See https://github.com/starnutoditopo/typescript-cubic-spline/issues/2
  it("no errors when querying outside of bounds (see https://github.com/starnutoditopo/typescript-cubic-spline/issues/2)", () => {
    const xs = [1, 2, 3, 4, 5];
    const ys = [9, 3, 6, 2, 4];

    // new a Spline object
    const spline = new Spline(xs, ys);

    // This returns is ok
    console.log(spline.at(-100)); 
    expect(spline.at(-100)).toBe(9);

    // This returns NaN
    console.log(spline.at(5.5)); 
    expect(spline.at(5.5)).toBe(4);
  });
});

describe("speed", function () {
  it("should run quickly on relatively large data, too", () => {
    let arraySizes = [10, 100, 1000, 2000, 4000];
    let arraySpeed = [];
    let arrayInitialization = [];
    let multiplicationFactor = 10; // array.length * multiplicationFactor = number of times the .at()-function is executed on the same array
    for (let i = 0; i < arraySizes.length; i++) {
      // generate x-y-set
      let setX: number[] = [];
      let setY: number[] = [];
      let x = 0;
      let y = 0;
      for (let j = 0; j < arraySizes[i]; j++) {
        x += 0.05;
        y = Math.sin(x);
        setX.push(Number(x.toFixed(2)));
        setY.push(Number(y.toFixed(4)));
      }
      // run cubic-spline-interpolation
      let initializationStart = new Date();
      const spline = new Spline(setX, setY);
      let initializationEnd = new Date();
      // interpolate spline at 10x resolution
      let atStart = new Date();
      for (let j = 0; j < arraySizes[i] * multiplicationFactor; j++) {
        spline.at(j * 0.05 + 0.01); // create a small offset to the actual data set
      }
      let atEnd = new Date();
      arrayInitialization[i] =
        Number(initializationEnd) - Number(initializationStart);
      arraySpeed[i] = Number(atEnd) - Number(atStart);
    }
    // print result
    console.log(`elements in | times .at() | initialization | execution time`);
    console.log(`dataset     | is used     | time of spline | of all .at()'s`);
    console.log(`------------|-------------|----------------|---------------`);
    for (let i = 0; i < arraySizes.length; i++) {
      let size = arraySizes[i].toString().padEnd(11);
      let at = (arraySizes[i] * multiplicationFactor).toString().padStart(11);
      let initializationTime = arrayInitialization[i].toString().padStart(12);
      let atTime = arraySpeed[i].toString().padStart(12);
      console.log(`${size} | ${at} | ${initializationTime}ms | ${atTime}ms`);
    }
  });
});
