const pluginSyntaxJsx = require('@babel/plugin-syntax-jsx').default;

const defaultFileNameList = ['/page.tsx', '/page.jsx'];

module.exports = function ({ types, template }, options) {
  const {
    importComponentFilePath,
    importComponentName,
    isImportDefault = true,
    needWrapperFileRelativePath = [],
  } = options ?? {};

  const optionsFileNameSet = new Set(
    needWrapperFileRelativePath
      ? [...defaultFileNameList, ...needWrapperFileRelativePath]
      : needWrapperFileRelativePath,
  );

  debugger;

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

          const programAstPath = astPath.find((parentPath) =>
            parentPath.isProgram(),
          );

          const bodyAstPath = programAstPath.get('body');
          for (const itembodyChildren of bodyAstPath) {
            let isImportAstNode = types.isImportDeclaration(itembodyChildren);

            if (isImportAstNode) {
              const importedPackageName = itembodyChildren
                .get('source')
                .toString();

              if (importedPackageName === `'${importComponentFilePath}'`) {
                const itemImportSpecifiersList =
                  itembodyChildren.get('specifiers');

                for (const itemImportSpecifier of itemImportSpecifiersList) {
                  const itemImportSpecifierName =
                    itemImportSpecifier.toString();

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
            let newImportTemplateFn = template(
              isImportDefault
                ? "import IMPORTFNPACKAGE from 'IMPORTPACKAGENAMEPATH'"
                : "import { IMPORTFNPACKAGE } from 'IMPORTPACKAGENAMEPATH'",
            );

            const newImportNodeAst = newImportTemplateFn({
              IMPORTFNPACKAGE: types.identifier(importComponentName),
              IMPORTPACKAGENAMEPATH: types.stringLiteral(
                importComponentFilePath,
              ),
            });

            state.isInsetByBabelPlugin = true;
            programAstPath.unshiftContainer('body', [newImportNodeAst]);

            // wrapper
            for (const itembodyChildren of bodyAstPath) {
              let isExportAstNode =
                types.isExportDefaultDeclaration(itembodyChildren);
              if (isExportAstNode) {
                let oldExportNode = itembodyChildren
                  .get('declaration')
                  .toString();

                const newExportNodeTemplateFn = template(
                  'export default IMPORTFNPACKAGE(OLDNOE)',
                );
                const newNode = newExportNodeTemplateFn({
                  IMPORTFNPACKAGE: types.identifier(importComponentName),
                  OLDNOE: oldExportNode,
                });

                itembodyChildren.replaceWith(newNode);
              }
            }
          }
        }
      },
    },
  };
};
