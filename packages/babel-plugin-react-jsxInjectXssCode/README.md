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