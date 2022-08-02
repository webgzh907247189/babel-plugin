const babelCore = require("@babel/core");
const removeConsole = require("../index.js");

// options -> { contain: [''], exclude: [''] }
const getBabelCoreTransformCode = (code, options) => {
	const plugins = options ? [ [removeConsole, options]] : [removeConsole];
	const transformAst = babelCore.transformSync(code, {
		plugins
	});
	return transformAst.code;
};

describe("remove-console-plugin", () => {
	it("测试参数都不传的情况", () => {
		const sourceCode = `
            let s = 1; 
            console.log(s, '??', 'notremove');
            console('??', 'notremove');
            console.info('??', 'notremo22ve');
            console.log(s, '??', 'notremove11');
            console.error(s, '??', 'notremove11');
      `;

		const expected = `
            let s = 1;
            console('??', 'notremove');
        `;

		expect(
			getBabelCoreTransformCode(sourceCode)
		).toBe(getBabelCoreTransformCode(expected));
	});  
    
	it("测试参数只传 exclude 的情况", () => {
		const sourceCode = `
            let s = 1; 
            console.log(s, '??', 'notremove');
            console('??', 'notremove');
            console.info('??', 'notremo22ve');
            console.log(s, '??', 'notremove11');
            console.error(s, '??', 'notremove11');
      `;

		const expected = `
            let s = 1; 
            console.log(s, '??', 'notremove');
            console('??', 'notremove');
            console.log(s, '??', 'notremove11');
        `;

		expect(
			getBabelCoreTransformCode(sourceCode, { exclude: ["log"] })
		).toBe(getBabelCoreTransformCode(expected, { exclude: ["log"] }));
	});  

        
	it("测试参数只传 contain 的情况", () => {
		const sourceCode = `
            let s = 1; 
            let a = '2'
            console.log(s, '??', 'notremove');
            console('??', 'notremove');
            console.info('??', 'notremo22ve');
            console.log(s, '??', 'notremove11');
            console.error(a, '??', 'notremove11');
      `;

		const expected = `
            let s = 1; 
            let a = '2'
            console.log(s, '??', 'notremove');
            console('??', 'notremove');
            console.log(s, '??', 'notremove11');
        `;

		expect(
			getBabelCoreTransformCode(sourceCode, { contain: [1] })
		).toBe(getBabelCoreTransformCode(expected, { contain: [1] }));
	});  

	it("测试所有参数都存在(contain exclude)的场景", () => {
		const sourceCode = `
            let s = 1; 
            let a = '2'
            console.log(s, '??', 'notremove');
            console('??', 'notremove');
            console.info('??', 'notremo22ve');
            console.log(s, '??', 'notremove11');
            console.error(a, '??', 'notremove11');
            console.error(s, '??', 'notremove');
      `;

		const expected = `
            let s = 1; 
            let a = '2'
            console.log(s, '??', 'notremove');
            console('??', 'notremove');
            console.log(s, '??', 'notremove11');
            console.error(s, '??', 'notremove');
        `;

		expect(
			getBabelCoreTransformCode(sourceCode, { contain: ["notremove"], exclude: ["log"] })
		).toBe(getBabelCoreTransformCode(expected, { contain: ["notremove"], exclude: ["log"] }));
	}); 

	it("测试所有参数都存在(contain exclude)的情况 & 存在作用于提升场景", () => {
		const sourceCode = `
            let s = 1; 
            let a = '2'
            const getList = () => {
                console.log(s, '??', 'notremove');
                console('??', 'notremove');
                console.info('??', 'notremo22ve');
                console.log(s, '??', 'notremove11');
            }
            console.error(a, '??', 'notremove11');
            console.error(s, '??', 'notremove');
      `;

		const expected = `
            let s = 1; 
            let a = '2'
            const getList = () => {
                console.log(s, '??', 'notremove');
                console('??', 'notremove');
                console.log(s, '??', 'notremove11');
            }
            console.error(s, '??', 'notremove');
        `;

		expect(
			getBabelCoreTransformCode(sourceCode, { contain: ["notremove"], exclude: ["log"] })
		).toBe(getBabelCoreTransformCode(expected, { contain: ["notremove"], exclude: ["log"] }));
	}); 
});