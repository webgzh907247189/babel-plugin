const pluginSyntaxJsx = require("@babel/plugin-syntax-jsx").default;

module.exports = function ({ types, template }, options) {
	return {
		inherits: pluginSyntaxJsx,
		visitor: {
			JSXAttribute(astPath, state) {
				const jsxIdentifierName = astPath.get("name").toString();
				if (jsxIdentifierName === "dangerouslySetInnerHTML") {
					// 默认是 importSpecifier 导入 使用 自定义的 覆盖默认配置
					const cusOptions = {
						...{ isImportSpecifier: true },
						...options,
					};

					const jsxIdentifierExpression = astPath.get("value").get("expression");

					const jsxPropertyList = jsxIdentifierExpression.get("properties");

					let hasDangerouslySetInnerHTML = false;
					// 处理 dangerouslySetInnerHTML 的情况
					for (const jsxPropertyItem of jsxPropertyList) {
						const jsxPropertyItemKey = jsxPropertyItem.get("key").toString();

						const jsxPropertyItemValue = jsxPropertyItem.get("value");
						if (jsxPropertyItemKey === "__html") {
							const jsxPropertyItemValueToString = jsxPropertyItemValue.toString();

							jsxPropertyItemValue.replaceWithSourceString(`${cusOptions.injectFnName}(${jsxPropertyItemValueToString})`);
							jsxPropertyItemValue.skip();

							hasDangerouslySetInnerHTML = true;
						}
					}

					// 有经过 xss方法 处理过 dangerouslySetInnerHTML.__html 情况
					// 需要处理 import 函数
					if (hasDangerouslySetInnerHTML) {
						// 是否 已经导入了 这个包
						let hasImportPackage = false;

						const programAstPath = astPath.find((parentPath) => parentPath.isProgram());

						// 找到 之前有没有 已经 import 该包 & 导入该函数
						const bodyAstPath = programAstPath.get("body");
						for (const itembodyChildren of bodyAstPath) {
							let isImportAstNode = types.isImportDeclaration(itembodyChildren);

							if (isImportAstNode) {
								const isImportSpecifier = cusOptions.isImportSpecifier;

								const importPackage = itembodyChildren.get("source").toString();

								// import { xxx } from cusOptions.packageName 的情况
								const cuspPackageName = `'${cusOptions.packageName}'`;
								if (isImportSpecifier && importPackage === cuspPackageName) {
									const itemImportSpecifiersList = itembodyChildren.get("specifiers");

									for (const itemImportSpecifier of itemImportSpecifiersList) {
										const itemImportSpecifierName = itemImportSpecifier.get("imported").toString();

										// 导入的 package 名字一样， 导入的函数名字也一样，说明 这个函数已经被 导入过了，不需要在导入
										if (itemImportSpecifierName === cusOptions.injectFnName) {
											hasImportPackage = true;
										}
									}
								}
							}
						}

						// 没有导入过 执行导入逻辑
						// state.isAlreadyInserted 为 true 代表已经插入一次
						if (!hasImportPackage && !state.isAlreadyInserted) {
							const newImportTemplateFn = template("import { IMPORTFN } from 'IMPORTPACKAGENAME'");
							const newImportNodeAst = newImportTemplateFn({
								IMPORTFN: types.identifier(cusOptions.injectFnName),
								IMPORTPACKAGENAME: types.stringLiteral(cusOptions.packageName),
							});

							newImportNodeAst.isNew = true;

							// 向根节点插入 import 元素
							programAstPath.unshiftContainer("body", [newImportNodeAst]);
							state.isAlreadyInserted = true;
						}
					}
				}
			},
		},
	};
};
