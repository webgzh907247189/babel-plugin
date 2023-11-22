const defaultExclude = new Set(["Fragment"]);
let exclude = defaultExclude;

module.exports = ({ types }, options) => {
	if (options.exclude) {
		const userExclude = Array.isArray(options.exclude)
			? options.exclude
			: [options.exclude];
		exclude = new Set([...userExclude, ...defaultExclude]);
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
				const cwd = state.file?.opts?.cwd || "src";

				// 可能出现 /a/b/src/c/d/src/e/src 情况
				// eslint-disable-next-line no-unsafe-optional-chaining
				const [, ...rest] = state.file?.opts?.filename.split(cwd);

				let fileName = rest.join("");
				// 去掉绝对路径
				fileName = fileName.startsWith("/") ? fileName.slice(1) : fileName;

				const comLine =
					astPath?.get?.("loc")?.get?.("start")?.get?.("line")?.node ?? "";

				// 渲染的文件
				const newPropRenderFileName = types.jSXAttribute(
					types.jSXIdentifier("render-file-name"),
					types.stringLiteral(fileName ?? "")
				);

				// 当前的 行
				const newPropComponentLine = types.jSXAttribute(
					types.jSXIdentifier("line"),
					types.stringLiteral(String(comLine) ?? "")
				);

				astPath.node.attributes.unshift(
					newPropRenderFileName,
					newPropComponentLine
				);
			},
		},
	};
};