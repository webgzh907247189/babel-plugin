const { getLowerCase, isArray } = require("cus-utils");

const CONSOLE = "console";

const getValNodeListByPath = (list, types) => {
	return list.reduce((result, item) => {
		// 暂时处理了 literal 和 identifier
		if (types.isLiteral(item)) {
			result.push(item.node.value);
		}

		if (types.isIdentifier(item)) {
			let matchItem = "";
			item.findParent((_) => {
				let consoleCallPrevNodeList = _.getAllPrevSiblings();
				let consoleCallNextNodeList = _.getAllNextSiblings();
				let consoleCallAllNodeList = [...consoleCallPrevNodeList, ...consoleCallNextNodeList];

				if (!matchItem && consoleCallAllNodeList.length) {
					const findList = consoleCallAllNodeList.reduce((resultList, nodeItem) => {
						if (isArray(nodeItem.node.declarations)) {
							let declarationList = nodeItem.node.declarations.reduce((findDeclarationList, declaration) => {
								if (declaration.id.name === item.node.name) {
									findDeclarationList.push({
										key: declaration.id.name,
										value: declaration.init.value,
									});
								}
								return findDeclarationList;
							}, []);

							resultList.push(...declarationList);
						}
						return resultList;
					}, []);
					matchItem = findList[0];
				}

				return _.isVariableDeclaration() || _.isProgram();
			});
			result.push(matchItem.value);
		}
		return result;
	}, []);
};

module.exports = function ({ types }, options) {
	return {
		name: "remove-console",
		visitor: {
			CallExpression(path) {
				let calleeObjectCode = path.get("callee").get("object").toString();
				let calleePropertyCode = path.get("callee").get("property").toString();

				// 同时设置了 exclude 和 contain， 优先以 contain 为判定条件
				if (options && isArray(options.exclude) && isArray(options.contain)) {
					let args = path.get("arguments");

					const argumentsValList = getValNodeListByPath(args, types);

					let containFlag = options.contain.some((_) => {
						const containItem = getLowerCase(_);
						return argumentsValList.some((argumentsValItem) => getLowerCase(argumentsValItem) === containItem);
					});

					const excludeFlag = options.exclude.some((excludeItem) => excludeItem === calleePropertyCode);
					// console.log(containFlag, 'flag', excludeFlag, argumentsValList)

					let flag = containFlag ? false : !excludeFlag;
					if (calleeObjectCode === CONSOLE && flag) {
						path.remove();
					}
					return;
				}

				// 只设置了不删除 console 的 contain
				if (options && isArray(options.contain)) {
					let args = path.get("arguments");

					// argumentsValList 需要完善，因为存在作用域的问题
					// 可能会出现 let s = 'notremove'; console.log(s, '222');
					const argumentsValList = getValNodeListByPath(args, types);
					let flag = options.contain.some((_) => {
						const containItem = getLowerCase(_);
						return argumentsValList.some((argumentsValItem) => getLowerCase(argumentsValItem) === containItem);
					});

					if (flag) return;
				}

				// 只设置了 不删除 console 的exclude
				if (options && isArray(options.exclude)) {
					const flag = options.exclude.some((_) => _ === calleePropertyCode);
					if (flag) return;
				}

				// 只要是 console.xx 就删除
				if (calleeObjectCode === CONSOLE) {
					path.remove();
				}
			},
		},
	};
};
