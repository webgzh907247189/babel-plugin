# babel-plugin-injectcomponentcode

### Installation

`npm i babel-plugin-injectcomponentcode`

## Usage

```javascript
const babelPluginInjectComponentCode = require('babel-plugin-injectcomponentcode');

// babel.config.js
// 在 next ｜ react 框架中 指定 jsx文件 进行 高阶组件行为

// options 配置 
// importComponentFilePath -> import 组件的 file path
// importComponentName -> import 组件的 name
// isImportDefault(可选参数) ->  是否默认导出(默认是 true)
// needWrapperFileRelativePath(可选参数) -> 需要被包裹的组件的相对路径

module.exports = {
    ...
    plugins: [
        ...
        [[
            injectcomponentcode, { 
                importComponentFilePath: '@/components/PageWrapper', 
                importComponentName: 'PageWrapper',
                isImportDefault: true, 
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