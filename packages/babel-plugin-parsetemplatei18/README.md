## babel-plugin-parsetemplatei18 
### 行覆盖率、函数覆盖率、分支覆盖率、语句覆盖率居均达到 100%
### https://juejin.cn/post/7121954521127288868

### Installation  
`npm i babel-plugin-parsetemplatei18`

## Demo

```javascript
const babelPluginParsetemplatei18 = require('babel-plugin-parsetemplatei18');
module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [[babelPluginParsetemplatei18, { calleeSourceCode: '_vm.providerI18n.t', calleeTargetCode: 'providerI18n' }]],
};
```

```javascript
import Vue from 'vue';

const mixinsGlobal = () => {
    Vue.mixin({
        beforeCreate() {
            if (this.$options && this.$options.i18n) {
                //根组件
                this.cusI18n = this.$options && this.$options.i18n;
            } else {
                // 深度先续遍历
                this.cusI18n = this.$parent && this.$parent.cusI18n;
            }
        },
    });
};
export default mixinsGlobal;

// other js run
mixinsGlobal();
```

```javascript
// webpack.config.js
new webpack.ProvidePlugin({
    providerI18n: [path.resolve(path.join(__dirname, 'xxxxx')), 'default'],
});
```

```javascript
  <el-select
    v-model="xxx"
    :placeholder="providerI18n.t('xxx')"
    style="width: 100%"
    size="small"
  >
    <el-option
      label="test"
      value="testVal"
    ></el-option>
  </el-select>
```

**Compile Vue template Out**

```javascript
// 不使用 parseTemplatei18 插件, 编译的结果为 _vm.providerI18n.t('xx')
// 使用 parseTemplatei18插件, 结果被替换为 providerI18n.t('xx')
providerI18n.t('xx');
```

## License
[MIT]