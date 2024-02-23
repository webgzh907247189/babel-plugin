# babel-plugin-react-injectxsscode

### Installation

`npm i babel-plugin-react-injectxsscode`

## Usage

```javascript
const babelPluginReactInjectXssCode = require('babel-plugin-react-injectxsscode');

// babel.config.js
module.exports = {
    ...
    plugins: [
        ...
        // packageName 是 编译之后 倒入的 npm 包名字
        // composeXssFn 是 packageName这个 npm包导出的函数
        // 从 [packageName] 导出 [composeXssFn] 函数给 dangerouslySetInnerHTML 使用
        [babelPluginReactInjectXssCode, { packageName: 'utils', injectFnName: 'composeXssFn' }]
    ]
}
```



## Example

### In

```javascript
<Demo dangerouslySetInnerHTML={{ __html: '111' }}/>
```

### Out
```javascript
import { composeXssFn } from 'utils'
<Demo dangerouslySetInnerHTML={{ __html: composeXssFn('111') }}/>
```