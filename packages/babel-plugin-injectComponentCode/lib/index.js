const pluginSyntaxJsx = require("@babel/plugin-syntax-jsx").default;

const defaultFileNameList = ["/page.tsx", "/page.jsx"];
const { glob } = require("glob");

// 使用 glob 模式 匹配文件
// 内置 ignore node_modules
module.exports = async function ({ types, template }, options) {
	const ignorePathList = Array.isArray(options.globIgnorePath) ? ['node_modules/**', ...options.globIgnorePath] : options.globIgnorePath;
	const globMachedFileList = await glob(options.globMatchPath , { ignore: ignorePathList})

	const { importComponentFilePath, importComponentName, isImportDefault = true } = options ?? {};
	const isUseGlob = options.globIgnorePath && options.globMatchPath

	const optionsFileNameSet = new Set(isUseGlob ? globMachedFileList : defaultFileNameList);

	return {
		inherits: pluginSyntaxJsx,
		visitor: {
			JSXElement(astPath, state) {
				const filename = state.filename;
				let matchFileFlag = false;
				for (const iteratorFileName of optionsFileNameSet) {
					if (filename.includes(iteratorFileName)) {
						matchFileFlag = true;
						break;
					}
				}

				if (matchFileFlag) {
					let needBabelPluginImported = true;

					const programAstPath = astPath.find((parentPath) => parentPath.isProgram());
					let oldExportNodeVal = "";
					let oldExportNode = "";

					const bodyAstPath = programAstPath.get("body");
					for (const itembodyChildren of bodyAstPath) {
						let isImportAstNode = types.isImportDeclaration(itembodyChildren);

						let isExportAstNode = types.isExportDefaultDeclaration(itembodyChildren);
						if (isExportAstNode) {
							oldExportNodeVal = itembodyChildren.get("declaration").toString();
							oldExportNode = itembodyChildren;
						}

						if (isImportAstNode) {
							// const importedPackageName = itembodyChildren.get("source").toString();
							const importedPackageName = itembodyChildren.get("source").node.value;	

							if (importedPackageName === importComponentFilePath) {
								const itemImportSpecifiersList = itembodyChildren.get("specifiers");

								for (const itemImportSpecifier of itemImportSpecifiersList) {
									const itemImportSpecifierName = itemImportSpecifier.toString();

									// 导入的 package 名字一样， 导入的函数名字也一样，说明 这个函数已经被 导入过了，不需要在导入
									if (itemImportSpecifierName === importComponentName) {
										needBabelPluginImported = false;
									}
								}
							}
						}
					}

					// 没有导入，需要 babel plugin 导入
					if (needBabelPluginImported && !state.isInsetByBabelPlugin) {
						let newImportTemplateFn = template(isImportDefault ? "import IMPORTFNPACKAGE from 'IMPORTPACKAGENAMEPATH'" : "import { IMPORTFNPACKAGE } from 'IMPORTPACKAGENAMEPATH'");

						const newImportNodeAst = newImportTemplateFn({
							IMPORTFNPACKAGE: types.identifier(importComponentName),
							IMPORTPACKAGENAMEPATH: types.stringLiteral(importComponentFilePath),
						});

						state.isInsetByBabelPlugin = true;
						programAstPath.unshiftContainer("body", [newImportNodeAst]);

						// wrapper
						if (oldExportNodeVal) {
							const newExportNodeTemplateFn = template("export default IMPORTFNPACKAGE(OLDNOE)");

							let replaceOldVal = oldExportNodeVal.replace(/\s*__source=\{{1}[^}]*\}}{1}\s*/g, "  ").replace(/\s*__self={this}\s*/g, "  ");

							const newNode = newExportNodeTemplateFn({
								IMPORTFNPACKAGE: types.identifier(importComponentName),
								OLDNOE: replaceOldVal,
							});
				
							oldExportNode.replaceWith(newNode);
						}
					}
				}
			},
		},
	};
};
