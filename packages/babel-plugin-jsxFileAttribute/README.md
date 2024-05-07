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

// options 配置 -> { isShowAwakeIdeMsg: true, onlyShowAwakeIdeMsg: true }
// 针对 monorepo 项目处理了 userSetPwd，用于切割 文件信息
// isShowAwakeIdeMsg 默认是true， 用户传入的 isShowAwakeIdeMsg 可以覆盖默认的 true
// onlyShowAwakeIdeMsg 默认是true， 控制展示在 DOM 里面的信息

// data-render-file-name 表示 当前 DOM 所在的组件 file 位置信息
// data-line 表示 当前 DOM 所在的组件 具体哪一行
// data-awakeide 表示 当前渲染的 DOM 所在的组件 具体某一个文件的 某一行 某一列
// onlyShowAwakeIdeMsg 传入 true，注入在 DOM 里 只会存在 data-awakeide 信息，data-render-file-name、data-line 均不展示
module.exports = {
    ...
    plugins: [
        ...
        [[
            babelPluginJsxFileAttribute, { userSetPwd: 'xxx', isShowAwakeIdeMsg: true, onlyShowAwakeIdeMsg: true }
        ]]
    ]
}
```

## Example

### In

```javascript
<Demo />
```

### Out
1. data-render-file-name 表示 当前 DOM 所在的组件 file 位置信息
2. data-line 表示 当前 DOM 所在的组件 具体哪一行
2. data-awakeide 表示 当前渲染的 DOM 所在的组件 具体某一个文件的 某一行 某一列
4. onlyShowAwakeIdeMsg 传入 true，注入在 DOM 里 只会存在 data-awakeide 信息，data-render-file-name、data-line 均不展示
```javascript
<Demo data-render-file-name="src/demo/index.jsx" data-line="xx"/>
```