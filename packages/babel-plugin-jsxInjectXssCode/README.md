# babel-plugin-injectxsscode

### Installation

`npm i babel-plugin-injectxsscode`

## Usage

```javascript
const babelPluginInjectXssCode = require('babel-plugin-injectxsscode');

// babel.config.js
module.exports = {
    ...
    plugins: [
        ...
        [babelPluginInjectXssCode, { packageName: 'utils', injectFnName: 'composeXssFn' }]
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