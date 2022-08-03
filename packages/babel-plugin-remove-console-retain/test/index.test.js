const babelCore = require("@babel/core");
const removeConsoleRetain = require("../index.js");

// options -> { contain: [''], exclude: [''] }
const getBabelCoreTransformCode = (code, options) => {
	const plugins = options ? [ [removeConsoleRetain, options]] : [removeConsoleRetain];
	const transformAst = babelCore.transformSync(code, {
		plugins
	});
	return transformAst.code;
};

describe("remove-console-plugin", () => {
	it("测试参数都不传的情况", () => {
		const sourceCode = `
                  let s = 1; 
                  console.log(s, 'notremove');
                  console('test', 'notremove');
                  console.info('test', 'test--notremove');
                  console.log(s, 'test', 'notremove--test');
                  console.error(s, 'test', 'notremove--test');
            `;

		const expected = `
                  let s = 1;
                  console('test', 'notremove');
            `;

		expect(
			getBabelCoreTransformCode(sourceCode)
		).toBe(getBabelCoreTransformCode(expected));
	});  
    
	it("测试参数只传 exclude 的情况", () => {
		const sourceCode = `
                  let s = 1; 
                  console.log(s, 'test', 'notremove');
                  console('test', 'notremove');
                  console.info('test', 'test--notremove');
                  console.log(s, 'test', 'notremove--test');
                  console.error(s, 'test', 'notremove--test');
            `;

		const expected = `
                  let s = 1; 
                  console.log(s, 'test', 'notremove');
                  console('test', 'notremove');
                  console.log(s, 'test', 'notremove--test');
            `;

		expect(
			getBabelCoreTransformCode(sourceCode, { exclude: ["log"] })
		).toBe(getBabelCoreTransformCode(expected, { exclude: ["log"] }));
	});  

        
	it("测试参数只传 contain 的情况", () => {
		const sourceCode = `
                  let s = 1; 
                  let a = '2'
                  console.log(s, 'test', 'notremove');
                  console('test', 'notremove');
                  console.info('test', 'test--notremove');
                  console.log(s, 'test', 'notremove--test');
                  console.error(a, 'test', 'notremove--test');
            `;

		const expected = `
                  let s = 1; 
                  let a = '2'
                  console.log(s, 'test', 'notremove');
                  console('test', 'notremove');
                  console.log(s, 'test', 'notremove--test');
            `;

		expect(
			getBabelCoreTransformCode(sourceCode, { contain: [1] })
		).toBe(getBabelCoreTransformCode(expected, { contain: [1] }));
	});  

	it("测试所有参数都存在(contain exclude)的场景", () => {
		const sourceCode = `
                  let s = 1; 
                  let a = '2'
                  console.log(s, 'test', 'notremove');
                  console('test', 'notremove');
                  console.info('test', 'test--notremove');
                  console.log(s, 'test', 'notremove--test');
                  console.error(a, 'test', 'notremove--test');
                  console.error(s, 'test', 'notremove--test');
            `;

		const expected = `
                  let s = 1; 
                  let a = '2'
                  console.log(s, 'test', 'notremove');
                  console('test', 'notremove');
                  console.log(s, 'test', 'notremove--test');
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
                        console.log(s, 'test', 'notremove');
                        console('test', 'notremove');
                        console.info('test', 'test--notremove');
                        console.log(s, 'test', 'notremove--test');
                  }
                  console.error(a, 'test', 'notremove--test');
                  console.error(s, 'test', 'notremove');
            `;

		const expected = `
                  let s = 1; 
                  let a = '2'
                  const getList = () => {
                        console.log(s, 'test', 'notremove');
                        console('test', 'notremove');
                        console.log(s, 'test', 'notremove--test');
                  }
                  console.error(s, 'test', 'notremove');
            `;

		expect(
			getBabelCoreTransformCode(sourceCode, { contain: ["notremove"], exclude: ["log"] })
		).toBe(getBabelCoreTransformCode(expected, { contain: ["notremove"], exclude: ["log"] }));
	}); 
});