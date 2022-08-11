const babelCore = require("@babel/core");
const parseTemplatei18 = require("../index");

const getBabelCoreTransformCode = (code) => {
	const transformAst = babelCore.transformSync(code, {
		plugins: [
			[parseTemplatei18, { calleeSourceCode: "_vm.providerI18n.t", calleeTargetCode: "providerI18n" }]
		]
	});
	return transformAst.code;
};

describe("parseTemplatei18-plugin", () => {
	it("测试parseTemplatei18 babel plugin", () => {
		const sourceCode = `
            let s = 1;
            const providerI18n = {
                t() {
                    console.log('1')
                }
            };
            _vm.providerI18n.t();
            providerI18n.t();
        `;

		const expected = `
            let s = 1;
            const providerI18n = {
                t() {
                    console.log('1')
                }
            };
            providerI18n.t();
            providerI18n.t();
        `;

		expect(
			getBabelCoreTransformCode(sourceCode)
		).toBe(getBabelCoreTransformCode(expected));
	});    
});