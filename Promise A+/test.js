import MyPromise from './MyPromise.js'

let myPromise = new MyPromise((resovle,reject) =>{
  setTimeout(()=>{
    resovle('success')
  },2000)
  
  // resovle('success')
})
const other = new MyPromise((resolve,reject)=>{
  resolve('other')
})

myPromise.then(val=>{
  console.log(1)
  console.log('resolve',val)
}).then(val=>{
  console.log(2)
  console.log('resolve',val)
})