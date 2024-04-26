
const defaultMultilingualList = ['_vm.$t', 'this.$t', 'this.$i18n.t']

module.exports = ({ types }, options) => {
	const cusCompiledMultilingualList = options.cusCompiledMultilingualList

	let multilingualList = []

	if(cusCompiledMultilingualList?.length === 0){
		// throw new Error('使用了该插件，但是 传入的 cusCompiledMultilingualList 为空数组， 请检查 cusCompiledMultilingualList')
		multilingualList = defaultMultilingualList
	}

	multilingualList = cusCompiledMultilingualList || defaultMultilingualList

    return {
        visitor: {
            CallExpression(astPath, state) {
                const calleeName = astPath.get('callee').toString()

				if(defaultMultilingualList.indexOf(calleeName) !== -1){
                    const filename = state.file.opts.filename

					const firstArgsNodeAst = astPath.get('arguments.0')
					
					if(types.isStringLiteral(firstArgsNodeAst)){
                        const firstArgsNodeAstVal = firstArgsNodeAst.node.value
                        options.resultList.push(firstArgsNodeAstVal)
                    }else{
                        options.resultList.push(firstArgsNodeAst.toString())
                        options.checkFileObj[filename] = true
                    }
                }
            }
        }
    }
};