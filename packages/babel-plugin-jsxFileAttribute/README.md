# babel-plugin-jsxfileattribute

### Installation

`npm i babel-plugin-jsxfileattribute`

## Usage

```javascript
const babelPluginJsxFileAttribute = require('babel-plugin-jsxfileattribute');

// babel.config.js
// 只在dev 环境使用
// 各业务团队根据 process.env.NODE_ENV 作出判断
// 默认针对 React.Fragment 标签进行了处理
module.exports = {
    ...
    plugins: [
        ...
        [babelPluginJsxFileAttribute]
    ]
}
```

## Example

### In

```javascript
<Demo />
```

### Out
```javascript
<Demo render-file-name="src/demo/index.jsx" line="xx"/>
```