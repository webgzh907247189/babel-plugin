# babel-plugin-injectcomponentcode

### Installation

`npm i babel-plugin-injectcomponentcode`

## Usage

```javascript
const babelPluginInjectComponentCode = require('babel-plugin-injectcomponentcode');

// babel.config.js
// 在 react 框架中 指定 jsx文件 进行 高阶组件行为
// 使用 glob 模式匹配

// options 配置 
// importComponentFilePath -> import 组件的 file path
// importComponentName -> import 组件的 name
// isImportDefault(可选参数) ->  是否默认导出(默认是 true)
// globMatchPath -> 需要被包裹的组件的相对路径 (参数规则同 glob)
// globIgnorePath -> 需要被忽略的组件的相对路径, 不会匹配 node_modules (参数规则同 glob)

// 如果没有传递 globMatchPath 和 globIgnorePath, 则会 只匹配 "/page.tsx" | "/page.jsx" 结尾的文件
module.exports = {
    ...
    plugins: [
        ...
        [[
            babelPluginInjectComponentCode, { 
                importComponentFilePath: '@/components/PageWrapper', 
                importComponentName: 'PageWrapper',
                isImportDefault: true, 
                globIgnorePath: "src/page/Home/index.tsx",
                globMatchPath: ["src/modules/KycRadioGroup/**/*.tsx"], // "src/page/**/*.tsx"
            }
        ]]
    ]
}
```

## Example

### In

```javascript
import xx from 'xx'
const Demo = () => {

}
export default Demo
```

### Out
```javascript
import PageWrapper from '@/components/PageWrapper'
import xx from 'xx'
const Demo = () => {

}
export default PageWrapper(Demo)
```