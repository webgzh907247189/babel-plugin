## babel-remove-conosle (行覆盖率、函数覆盖率、分支覆盖率、语句覆盖率居均达到 100%)

### 移除 项目中的 conosle
 1. 可以选择保留一些 conosle，通过 exclude 排除一些不需要移除的 conosle.xx  
 2. 可以 通过 contain, 只要是 带 contain 里面的关键字的 console.xx 就不会被移除 
## Demo

```javascript
const babelRemoveConsole = require('babel-remove-console');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelRemoveConsole, { exclude: ['log'], contain: ['node remove'] }]],
};
```

## Example

### In

```javascript
const babelRemoveConsole = require('babel-remove-console');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelRemoveConsole, { exclude: ['log'], contain: ['notremove'] }]],
};

let s = 1;
let a = '2';
const getList = () => {
    console.log(s, '??', 'notremove');
    console('??', 'notremove');
    console.info('??', 'notremo22ve');
    console.log(s, '??', 'notremove11');
};
console.error(a, '??', 'notremove11');
console.error(s, '??', 'notremove');
```

### Out

```javascript
let s = 1;
let a = '2';
const getList = () => {
    console.log(s, '??', 'notremove');
    console('??', 'notremove');
    console.log(s, '??', 'notremove11');
};
console.error(s, '??', 'notremove');
```

### In

```javascript
const babelRemoveConsole = require('babel-remove-console');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelRemoveConsole, { exclude: ['log'], contain: ['notremove'] }]],
};

let s = 1;
let a = '2';
console.log(s, '??', 'notremove');
console('??', 'notremove');
console.info('??', 'notremo22ve');
console.log(s, '??', 'notremove11');
console.error(a, '??', 'notremove11');
console.error(s, '??', 'notremove');
```

### Out

```javascript
let s = 1;
let a = '2';
console.log(s, '??', 'notremove');
console('??', 'notremove');
console.log(s, '??', 'notremove11');
console.error(s, '??', 'notremove');
```

### In

```javascript
const babelRemoveConsole = require('babel-remove-console');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelRemoveConsole]],
};

let s = 1;
console.log(s, '??', 'notremove');
console('??', 'notremove');
console.info('??', 'notremo22ve');
console.log(s, '??', 'notremove11');
console.error(s, '??', 'notremove11');
```

### Out

```javascript
let s = 1;
console('??', 'notremove');
```

### In

```javascript
const babelRemoveConsole = require('babel-remove-console');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelRemoveConsole, { exclude: ['log'] }]],
};

let s = 1;
console.log(s, '??', 'notremove');
console('??', 'notremove');
console.info('??', 'notremo22ve');
console.log(s, '??', 'notremove11');
console.error(s, '??', 'notremove11');
```

### Out

```javascript
let s = 1;
console.log(s, '??', 'notremove');
console('??', 'notremove');
console.log(s, '??', 'notremove11');
```

### In

```javascript
const babelRemoveConsole = require('babel-remove-console');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelRemoveConsole, { contain: [1] }]],
};

let s = 1;
let a = '2';
console.log(s, '??', 'notremove');
console('??', 'notremove');
console.info('??', 'notremo22ve');
console.log(s, '??', 'notremove11');
console.error(a, '??', 'notremove11');
```

### Out

```javascript
let s = 1;
let a = '2';
console.log(s, '??', 'notremove');
console('??', 'notremove');
console.log(s, '??', 'notremove11');
```
