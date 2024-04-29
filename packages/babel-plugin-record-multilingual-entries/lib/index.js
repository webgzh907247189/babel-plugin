
const fs = require('fs');
const path = require('path');


// 单列模式获取 streamData 只创建一次 writeStream
const getStreamDataWrapper = () => {
    let streamData;
    return (options) => {
        if(!streamData){
            console.log('create');
            streamData = fs.createWriteStream(options.writerPath,{
                  flags:'a'
            });
            return streamData;
        }
        console.log('no-create');
        
        return streamData;
    } 
}


let getStreamData = getStreamDataWrapper();


const defaultMultilingualList = ['_vm.$t', 'this.$t', 'this.$i18n.t'];
const recordLanByBabelPlugin = ({ types }, options) => {
    let streamData = '';
    if(options.writerPath){
        streamData = getStreamData(options);
    }

    const cusCompiledMultilingualList = options.cusCompiledMultilingualList;

    let multilingualList = [];

    if(cusCompiledMultilingualList?.length === 0){
        // throw new Error('使用了该插件，但是 传入的 cusCompiledMultilingualList 为空数组， 请检查 cusCompiledMultilingualList')
        multilingualList = defaultMultilingualList;
    }

    multilingualList = cusCompiledMultilingualList || defaultMultilingualList;

    return {
        visitor: {
            CallExpression(astPath, state) {
                const calleeName = astPath.get('callee').toString();

                if(defaultMultilingualList.indexOf(calleeName) !== -1){
                    const filename = state.file.opts.filename;

                    const firstArgsNodeAst = astPath.get('arguments.0');
                    
                    if(types.isStringLiteral(firstArgsNodeAst)){
                        const firstArgsNodeAstVal = firstArgsNodeAst.node.value;
                        options.resultList.push(firstArgsNodeAstVal);
                    }else{
                        options.resultList.push(firstArgsNodeAst.toString());
                        options.checkFileObj[filename] = true;
                    }


                    // 存在 writerPath 路径， 用流的方式 直接写入到该文件
                    if(options.writerPath){
                        let logger = new console.Console(streamData);
                        logger.log(firstArgsNodeAst.toString());
                    }
                }
            }
        }
    }
};

module.exports = recordLanByBabelPlugin;


// 执行结束，释放内存
process.on('beforeExit', function(code) {
    console.log('执行结束，释放内存');
    getStreamData = null;
});
