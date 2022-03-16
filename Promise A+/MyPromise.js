

// 先定义三个状态常量
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
// 创建一个了
class MyPromise{
  constructor(executor){
    // 构造函数接收一个执行器，并立即执行
    // 执行器 传入resolve 和 reject 方法
    try {
      executor(this.resolve,this.reject)
    }catch(err){
      // 如果有错误，直接执行 reject
      this.reject(err)
    }
  }
  // 存储状态的变量
  _status = PENDING
  // 成功之后的值
  _value = null
  // 失败的原因
  _reason = null
  // 存放成功后的回调
  _onFulfilledCallback = []
  // 存放失败后的回调
  _onRejectedCallback = []

  // 更改成功后的状态
  resolve = (value) => {
    // 只有状态是等待，才执行状态修改
    if(this._status === PENDING){
      this._status = FULFILLED
      this._value = value
      // 循环执行回调
      while(this._onFulfilledCallback.length){
        this._onFulfilledCallback.shift()(value)
      }
    }
  }

  // 更改失败后的状态
  reject = (reason) => {  
    // 只有状态是等待，才执行状态修改
    if(this._status === PENDING){
      this._status = REJECTED
      this._reason = reason
      // 循环执行回调
      while(this._onRejectedCallback.length){
        this._onRejectedCallback.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    // 如果不传，就使用默认函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    
    // 为了链式调用，这里创建一个MyPromise，并return出去
    const promise = new MyPromise((resolve, reject) => {
      if (this._status === FULFILLED) {
        queueMicrotask(()=>{
          try{
            // 获得回调处理结果
            const x = onFulfilled(this._value)
            // 集中处理回调返回值
            resolvePromise(promise, x, resolve, reject)
          }catch(err){
            reject(err)
          }
        })
      } else if (this._status === REJECTED) {
        queueMicrotask(()=>{
          try{
            const x = onRejected(this._reason)
            // 集中处理回调返回值
            resolvePromise(promise, x, resolve, reject)
          }catch(err){
            reject(err)
          }
        })
      } else if (this._status === PENDING) {
        // 状态为等待，则记录回调函数
        // 等到执行成功失败函数的时候再执行
        this._onFulfilledCallback.push(() => {
          queueMicrotask(()=>{
            try{
              const x = onFulfilled(this._value)
              resolvePromise(promise, x, resolve, reject)
            }catch(err){
              reject(err)
            }
          })
        })
        this._onRejectedCallback.push(() => {
          queueMicrotask(()=>{
            try{
              const x = onRejected(this._reason)
              resolvePromise(promise, x, resolve, reject)
            }catch(err){
              reject(err)
            }
          })
        })
      }
    })
    return promise
  }
  // resolve 静态方法
  static resolve(arg){
    // 如果参数时MyPromise实例就直接返回
    if(arg instanceof MyPromise){
      return arg
    }
    // 转换成常规方式
    return new MyPromise((resolve, reject)=>{
      resolve(arg)
    })
  }
  // reject 静态方法
  static reject(reason){
    return new MyPromise((resolve, reject)=>{
      reject(reason)
    })
  }
}

MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
}

// 处理回调返回值
function resolvePromise(promise, x, resolve, reject) {
  // 如果返回的是自己，抛出错误并返回
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断 x 是不是 MyPromise 实例
  if (typeof x === 'object' || typeof x === 'function') {
    if(x === null){
      return resolve(x)
    }
    let then
    try {
      // 把 x.then 赋值给then
      then = x.then
    }catch(error){
      // 如果取 x.then 的值时抛出错误 error ，则以 error 为据因拒绝 promise
      return reject(error);
    }

    // 如果 then 是函数
    if (typeof then === 'function') {
      let called = false;
      try {
        then.call(
          x, // this 指向 x
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          y => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          r => {
            if (called) return;
            called = true;
            reject(r);
          });
      } catch (error) {
        // 如果调用 then 方法抛出了异常 error：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
        if (called) return;

        // 否则以 error 为据因拒绝 promise
        reject(error);
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    resolve(x)
  }
}

module.exports = MyPromise