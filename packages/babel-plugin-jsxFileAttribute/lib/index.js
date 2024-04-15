const defaultExclude = new Set(["Fragment"]);
let exclude = defaultExclude;

let isShowAwakeIdeMsg = true;
let onlyShowAwakeIdeMsg = true;

module.exports = ({ types }, options) => {
	if (options.exclude) {
		const userExclude = Array.isArray(options.exclude)
			? options.exclude
			: [options.exclude];
		exclude = new Set([...userExclude, ...defaultExclude]);
	}

	if(options.isShowAwakeIdeMsg){
		isShowAwakeIdeMsg = !!options.isShowAwakeIdeMsg;
	}
	if(options.onlyShowAwakeIdeMsg){
		onlyShowAwakeIdeMsg = !!options.onlyShowAwakeIdeMsg;
	}

	return {
		visitor: {
			JSXOpeningElement(astPath, state) {
				const jsxOpeningElement = astPath.get("name").toString();

				// Fragment 是react 独有的特殊标签
				// 匹配到 <Fragment></Fragment> 不在执行，匹配到<></> 继续执行
				if (exclude.has(jsxOpeningElement)) {
					return;
				}

				// 当前 pwd  默认 src
				const cwd = options.userSetPwd ? options.userSetPwd : (state.file?.opts?.cwd || "src");

				// 可能出现 /a/b/src/c/d/src/e/src 情况
				// eslint-disable-next-line no-unsafe-optional-chaining
				const [, ...rest] = state.file?.opts?.filename.split(cwd);

				let fileName = rest.join("");
				// 去掉绝对路径
				fileName = fileName.startsWith("/") ? fileName.slice(1) : fileName;

				const comLine =
					astPath?.get?.("loc")?.get?.("start")?.get?.("line")?.node ?? "";
				const comColumn =
					astPath?.get?.("loc")?.get?.("start")?.get?.("column")?.node ?? "";

				let newPropRenderFileName = ''
				let newPropComponentLine = ''

				if(!onlyShowAwakeIdeMsg){
					// 渲染的文件
					newPropRenderFileName = types.jSXAttribute(
						types.jSXIdentifier("data-render-file-name"),
						types.stringLiteral(fileName ?? "")
					);

					// 当前的 行
					newPropComponentLine = types.jSXAttribute(
						types.jSXIdentifier("data-line"),
						types.stringLiteral(String(comLine) ?? "")
					);
				}
				let showAwakeIdeMsg = ''
				
				if(isShowAwakeIdeMsg){
					showAwakeIdeMsg = types.jSXAttribute(
						types.jSXIdentifier("data-awakeIde"),
						types.stringLiteral(String(`${fileName}:${comLine}:${comColumn}`) ?? "")
					);
				}

				const insertList = [showAwakeIdeMsg, newPropRenderFileName, newPropComponentLine].filter(_ => _ !== '')
				astPath.node.attributes.unshift(...insertList);
			},
		},
	};
};