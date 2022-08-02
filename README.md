## 两个 babel 插件 (行覆盖率、函数覆盖率、分支覆盖率、语句覆盖率居均达到100%)

### babel-remove-console 移除 项目中的 conosle  
 1. 可以选择保留一些 conosle，通过 exclude 排除一些不需要移除的 conosle.xx  
 2. 可以 通过 contain, 只要是 带 contain 里面的关键字的 console.xx 就不会被移除 

### parseTemplatei18 
1.  在国家化业务中使用，简化反复 import 文件 (https://juejin.cn/post/7121954521127288868)