/**
 * 简单用ts实现Promise
 */

let indexCount: number;

export class MyPromise {

    private thenFuncArr: Function[];
    private catchFunc: Function;
    private finishFunc: Function;

    private doFunc: Function;

    constructor(func: Function) {
        this.doFunc = func;

        this.thenFuncArr = [];
    }

    start() {
        indexCount = 0;
        if (this.doFunc) {
            indexCount++;
            this.doFunc(this.thenFuncArr[indexCount - 1], this.catchFunc);
        }
    }

    then(func: Function) {
        this.thenFuncArr.push(function (...args: []) {
            indexCount++;
            if (indexCount > this.thenFuncArr.length) {
                func.apply(this, args);
                if (this.finishFunc) {
                    this.finishFunc();
                }
                return;
            }
            func.apply(this, [this.thenFuncArr[indexCount - 1], this.catchFunc].concat(args));
        }.bind(this));
        return this;
    }

    catch(func: Function) {
        let self = this;
        self.catchFunc = function (...args: []) {
            func.apply(this, args);
            if (self.finishFunc) {
                self.finishFunc();
            }
        };
        return this;
    }

    finally(func: Function) {
        let self = this;
        self.finishFunc = function (...args: []) {
            func.apply(this, args);
        };;
        return this;
    }
}

let test = new MyPromise(function (resolve, reject) {
    console.log(1);
    resolve(2);
}).then(function (resolve, reject, num) {
    console.log(`then 1 ${num}`);
    resolve(num + 1);
}).then(function (resolve, reject, num) {
    console.log(`then 2 ${num}`);
    reject(num + 1);
}).then(function (resolve, reject, num) {
    console.log(`then 3 ${num}`);
    resolve(num + 1);
}).then(function (resolve, reject, num) {
    console.log(`then 4 ${num}`);
    resolve(num + 1);
}).then(function (resolve, reject, num) {
    console.log(`then 5 ${num}`);
    resolve(num + 1);
}).then(function (num) {
    console.log(`then 6 ${num}`);
}).catch(function () {
    console.log('catch');
}).finally(function () {
    console.log('finally');
});
test.start();
