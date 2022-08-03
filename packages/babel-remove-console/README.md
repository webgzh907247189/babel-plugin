## babel-remove-conosle

### 行覆盖率、函数覆盖率、分支覆盖率、语句覆盖率居均达到 100%
### 移除 项目中的 conosle
 1. 通过 exclude 排除一些不需要移除的 conosle.xx (选择保留一些 conosle)
 2. 通过 contain 包含一些不需要移除的 console.XX (带 contain 里面的关键字的 console.xx 就不会被移除)

## Demo

```javascript
const babelRemoveConsole = require('babel-remove-console');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelRemoveConsole, { exclude: ['log'], contain: ['node remove'] }]],
};
```

## Example

### case1 In

```javascript
const babelRemoveConsole = require('babel-remove-console');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelRemoveConsole, { exclude: ['log'], contain: ['notremove'] }]],
};

let s = 1; 
let a = '2'
const getList = () => {
    console.log(s, 'test', 'notremove');
    console('test', 'notremove');
    console.info('test', 'test--notremove');
    console.log(s, 'test', 'notremove--test');
}
console.error(a, 'test', 'notremove--test');
console.error(s, 'test', 'notremove');
```

### Out

```javascript
let s = 1; 
let a = '2'
const getList = () => {
    console.log(s, 'test', 'notremove');
    console('test', 'notremove');
    console.log(s, 'test', 'notremove--test');
}
console.error(s, 'test', 'notremove');
```



### case2 In

```javascript
const babelRemoveConsole = require('babel-remove-console');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelRemoveConsole, { exclude: ['log'], contain: ['notremove'] }]],
};

let s = 1; 
let a = '2'
console.log(s, 'test', 'notremove');
console('test', 'notremove');
console.info('test', 'test--notremove');
console.log(s, 'test', 'notremove--test');
console.error(a, 'test', 'notremove--test');
console.error(s, 'test', 'notremove--test');
```

### Out

```javascript
let s = 1; 
let a = '2'
console.log(s, 'test', 'notremove');
console('test', 'notremove');
console.log(s, 'test', 'notremove--test');
```


### case3 In

```javascript
const babelRemoveConsole = require('babel-remove-console');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelRemoveConsole]],
};

let s = 1; 
console.log(s, 'notremove');
console('test', 'notremove');
console.info('test', 'test--notremove');
console.log(s, 'test', 'notremove--test');
console.error(s, 'test', 'notremove--test');
```

### Out

```javascript
let s = 1;
console('test', 'notremove');;
```



### case4 In

```javascript
const babelRemoveConsole = require('babel-remove-console');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelRemoveConsole, { exclude: ['log'] }]],
};

let s = 1; 
console.log(s, 'test', 'notremove');
console('test', 'notremove');
console.info('test', 'test--notremove');
console.log(s, 'test', 'notremove--test');
console.error(s, 'test', 'notremove--test');
```

### Out

```javascript
let s = 1; 
console.log(s, 'test', 'notremove');
console('test', 'notremove');
console.log(s, 'test', 'notremove--test');
```

### case5 In

```javascript
const babelRemoveConsole = require('babel-remove-console');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelRemoveConsole, { contain: [1] }]],
};

let s = 1; 
let a = '2'
console.log(s, 'test', 'notremove');
console('test', 'notremove');
console.info('test', 'test--notremove');
console.log(s, 'test', 'notremove--test');
console.error(a, 'test', 'notremove--test');
```

### Out

```javascript
let s = 1; 
let a = '2'
console.log(s, 'test', 'notremove');
console('test', 'notremove');
console.log(s, 'test', 'notremove--test');
```
