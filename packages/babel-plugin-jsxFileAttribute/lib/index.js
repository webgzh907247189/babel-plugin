// const path = require("path");

// const tag =
//     'a,i,address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
//     'details,dialog,div,span,dl,dt,fieldset,figcaption,figure,footer,form,' +
//     'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
//     'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,table' +
//     'title,tr,track,nuxt-link,nuxt,img,template,svg,path' +
//     's,samp,small,span,strong,sub,sup,time,u,ul,p,ol,i' +
//     'button,datalist,input,label,meter,pre'

// 暂时无用， 所有的标签都带上 信息
// const makeMap = tag.split(',').reduce((result, item) => {
//     result[item] = true
//     return result
// }, Object.create(null))

module.exports = ({ types }) => {
	return {
		visitor: {
			JSXOpeningElement(astPath, state) {
				// const jsxOpeningElement = astPath.get("name").toString();

				// if (!makeMap[jsxOpeningElement]) {

				// 当前 pwd  默认 src
				const cwd = state.file?.opts?.cwd || "src";

				// 可能出现 /a/b/src/c/d/src/e/src 情况
				// eslint-disable-next-line no-unsafe-optional-chaining
				const [, ...rest] = state?.file?.opts?.filename?.split?.(cwd);

				let fileName = rest.join("");
				// 去掉绝对路径
				fileName = fileName.startsWith("/") ? fileName.slice(1) : fileName;

				const comLine = astPath?.get?.("loc")?.get?.("start")?.get?.("line")?.node ?? "";

				// 渲染的文件
				const newPropRenderFileName = types.jSXAttribute(types.jSXIdentifier("render-file-name"), types.stringLiteral(fileName ?? ""));

				// 当前的 行
				const newPropComponentLine = types.jSXAttribute(types.jSXIdentifier("line"), types.stringLiteral(String(comLine) ?? ""));

				astPath.node.attributes.unshift(newPropRenderFileName, newPropComponentLine);
			},
			// }
		},
	};
};
