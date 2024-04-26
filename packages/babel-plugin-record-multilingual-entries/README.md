# babel-plugin-record-multilingual-entries

### Installation

`npm i babel-plugin-record-multilingual-entries`

## Usage

```javascript
const babelPluginRecordMultilingualEntries = require('babel-plugin-record-multilingual-entries');

module.exports = {
    ...
    plugins: [
        ...
        [[
            babelPluginRecordMultilingualEntries, { 
                // 用户自定义的 多语言方法体, 传入该参数会覆盖插件 默认的方法体 (该插件 默认是 -> ['_vm.$t', 'this.$t', 'this.$i18n.t'])
                // cusCompiledMultilingualList: [],

                // 当有 多语言词条是 拼接的例如: $t('a' + item), 此时该文件路径就会被记录到 checkFileObj (需要手动确认词条)
                checkFileObj: {},

                // 结果集
                resultList: []
            }
        ]]
    ]
}
```

## Example
1. 见文章 https://juejin.cn/post/7361805210639400972

